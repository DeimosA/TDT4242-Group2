/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * Override default create method
 */
const create = (req, res) => {
  const order = [...req.body];
  const { userId } = req.session;

  validateInput({ order: order, userId: userId })
    .then(findUser)
    .then(findProducts)
    .then(processOrder)
    .then(createOrder)
    .then(res.created)
    .catch(res.negotiate);
};

/**
 * Confirm a placed order
 */
const confirm = (req, res) => {
  const { id: orderId } = req.params;
  const { userId } = req.session;

  Order.update({
    id: orderId,
    user: userId,
  }, {
    user_confirmed: true,
  }).then(res.ok).catch(res.negotiate);
};

/**
 * Dismiss a placed order
 */
const dismiss = (req, res) => {
  const { id: orderId } = req.params;
  const { userId } = req.session;

  Order.destroy({
    id: orderId,
    user: userId,
    status: 'PENDING',
  }).then(res.ok).catch(res.negotiate);
};

/**
 * Set/change order status
 */
const setStatus = (req, res) => {

  const allowedStatuses = [
    // 'PENDING', Should not be able to set back to pending
    'ACCEPTED',
    'AWAITING_RESUPPLY',
    'SHIPPED',
    'CANCELLED',
  ];
  const criteria = {
    id: req.params.id,
    // Must be confirmed by user to change status
    user_confirmed: true,
  };

  // Only allow selected statuses
  if (!allowedStatuses.includes(req.body.status)) {return res.badRequest({error: 'Status not allowed'});}

  Order.update(criteria, {status: req.body.status}).then(updatedOrder => {
    if (!updatedOrder || updatedOrder.length < 1) {
      return res.notFound({error: 'Could not find order with the provided criteria'});
    }
    // TODO mail service call
    return res.json(updatedOrder[0]);
  }).catch(res.negotiate);
};

/**
 * Validate input data
 */
const validateInput = ({ ...params }) => {
  return new Promise((resolve) => {

    if (!(params.order instanceof Array) || params.order.length === 0) {
      throw new Error({ status: 400, message: 'Your order is in invalid format' });
    }

    if (!params.userId) {
      throw new Error({ status: 403, message: 'No userId' });
    }

    params.order.forEach((item) => {
      if (!item.hasOwnProperty('productId') ||
        !item.hasOwnProperty('quantity') ||
        item.quantity <= 0) {
        throw new Error({ status: 400, message: 'Your order has invalid array objects' });
      }
    });

    resolve(params);
  });
};

/**
 * Find user information from id
 */
const findUser = async ({ ...params }) => {
  const user = await User.findOne(params.userId);
  if (!user) {
    throw new Error({ status: 403, message: 'User not found' });
  }

  return { user: user, ...params };
};

/**
 * Populate order items with product information
 */
const findProducts = async ({ ...params }) => {
  const productIds = params.order.map((item) => item.productId);
  const products = await Product.find({ id: productIds, listed: true });

  if (products.length !== params.order.length) {
    throw new Error({ status: 400, message: 'Product(s) not listed' });
  }

  const merged = products.map((item) => {
    return {
      quantity: params.order.find(e => item.id === e.productId).quantity,
      product: item,
    };
  });

  return { ...params, order: merged };
};

/**
 * Process order by obtaining details of the purchase
 */
const processOrder = ({ ...params }) => {
  const calculatePrice = {
    NO_SALE: ({ quantity, product }) => {
      return quantity * product.price;
    },

    PRICE_MOD: ({ quantity, product }) => {
      return quantity * (product.price * product.price_mod).toFixed(2);
    },

    PACKAGE: ({ quantity, product }) => {
      const discounted = Math.floor(quantity / product.package_get_count) * product.package_pay_count * product.price;
      const remainder = (quantity % product.package_get_count) * product.price;
      return discounted + remainder;
    },
  };

  const products = params.order.map((item) => {
    return {
      product: item.product,
      quantity: item.quantity,
      line_price: calculatePrice[item.product.on_sale](item),
    };
  });
  const totalPrice = products.reduce(
    (accumulator, current) => {
      return accumulator + current.line_price;
    }, 0);

  return {
    products: products,
    user: params.user.id,
    total_price: totalPrice,
  };
};

/**
 * Creates a new order
 */
const createOrder = async (orderDetails) => {

  return await Order.create({
    user: orderDetails.user,
    total_price: orderDetails.total_price,
    order_details: orderDetails.products,
  });
};

module.exports = { create, confirm, dismiss, setStatus };

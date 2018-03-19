/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const a = test => {
  return new Promise(res => {
    res(test)
  })
}

const validateData = (data) => {
  return new Promise((resolve, reject)) => {

    if (!data instanceof Array || data.length === 0) {
      reject('Your order is in invalid format')
    }

    data.forEach((item) => {
      if (!item.productId && !item.quantity) {
        reject('Your order is in invalid format')
      }
    })

    resolve(data)
  })
}

module.exports = {

  /**
   * Override default create method
   */
  create: function (req, res) {
    const order = [...req.body]
    User.find({}).exec(e => console.log(e),res.negotiate(e)).catch(console.log)
    /*
    validateData(order)
      .then((order) => {
        User.find({}).exec(e => console.log(e))
      })


      .catch((e) => {
      console.log('ERROR', e)
    })


    /*

    console.log(products)


    a('LOL').then(console.log).catch(console.log)

    // Check if logged in user exists
    User.findOne(req.session.userId).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.unauthorized();

      // Fetch product details from DB
      // TODO don't allow buying unlisted products
      Product.find({id: Object.keys(orderQuantity)}).exec(function (err, products) {
        if (err) return res.negotiate(err);
        if (!products) return res.badRequest({error: 'None of the products you ordered exist (we think)'});
        if (products.length !== req.body.length) return res.badRequest({error: (req.body.length - products.length) +
          ' product(s) in your request do not exist or your request contains dupes'});

        // Accumulate total price for order
        let priceAccumulator = 0;
        // Details about this order that is returned to the user
        let orderDetails = {};
        orderDetails.products = [];

        // Iterate over our products and calculate price
        for (let product of products) {

          let quantity = orderQuantity[product.id];
          let productPrice = 0;

          switch (product.on_sale) {
            case 'PRICE_MOD': // Percent sale
              productPrice = quantity * product.price * product.price_mod;
              break;

            case 'PACKAGE': // a for b package deal
              // Calculate total price for number of full packages and the remaining number
              let packageCount = Math.floor(quantity / product.package_get_count);
              let remainder = quantity % product.package_get_count;
              // Price to pay for full packages
              productPrice = packageCount * product.package_pay_count * product.price;
              // Add price for remaining product quantity
              productPrice += remainder * product.price;
              break;

            default: // Full price, just for you
              productPrice = quantity * product.price;
          } // switch

          // Add product price sum rounded to two decimals
          productPrice = +productPrice.toFixed(2);
          priceAccumulator += productPrice;

          orderDetails.products.push({product: product, quantity: quantity, sum: productPrice});
        } // for products end

        orderDetails.totalPrice = priceAccumulator;
        orderDetails.orderNumber = null;

        // Create a new order
        Order.create({user: user.id, total_price: priceAccumulator, order_details: orderDetails}).exec(
          function (err, order) {
          if (err) return res.negotiate(err);
          if (!order) return res.serverError();

          order.order_details.orderNumber = order.id;
          order.order_details.orderDate = order.createdAt;
          order.save(function (err) {
            return res.created(order.order_details);
          });

        }); // Order callback end
      }); // Product callback end
    }); // User callback end
  */
  },

  /**
   * Confirm a placed order
   */
  confirm: function (req, res) {
    Order.findOne(req.params.id).exec(function (err, order) {
      if (err) return res.negotiate(err);
      if (!order) return res.notFound({error: 'Order not found'});
      if (order.user !== req.session.userId)
        return res.forbidden({error: 'You are not permitted to perform this action'});

      Order.update(order.id, {user_confirmed: true}).exec(function (err, order) {
        if (err) return res.negotiate(err);
        if (!order || order.length < 1) return res.notFound({error: 'Order not found'});

        return res.json(order);
      });
    });
  },

  /**
   * Dismiss a placed order
   */
  dismiss: function (req, res) {
    Order.findOne(req.params.id).exec(function (err, order) {
      if (err) return res.negotiate(err);
      if (!order) return res.notFound({error: 'Order not found'});
      if (order.user !== req.session.userId)
        return res.forbidden({error: 'You are not permitted to perform this action'});
      if (order.user_confirmed && order.status !== 'PENDING')
        return res.badRequest({error: 'Can not dismiss an accepted order'});

      Order.destroy(order.id).exec(function (err, deletedOrder) {
        if (err) return res.negotiate(err);
        if (!deletedOrder || deletedOrder.length < 1) return res.notFound({error: 'Order not found'});

        return res.json(deletedOrder);
      });
    });
  }

};

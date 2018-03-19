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
  const order = [...req.body]
  const { userId } = req.session

  validateInput({ order: order, userId: userId })
    .then(findUser)
    .then(findProducts)
    .then(processOrder)
    .then(createOrder)
    .then(res.created)
    .catch(res.negotiate)

}

/**
 * Confirm a placed order
 */
const confirm = (req, res) => {
  const { id: productId } = req.params
  const { userId } = req.session

  Order.update({
    id: productId,
    user: userId 
  }, {
    user_confirmed: false 
  }).then(res.ok).catch(res.negotiate)

}

/**
 * Dismiss a placed order
 */
const dismiss = (req, res) => {
  const { id: productId } = req.params
  const { userId } = req.session

  Order.destroy({
    id: productId,
    user: userId,
    user_confirmed: false,
    status: { '!' : 'PENDING' }
  }).then(res.ok).catch(res.negotiate)

}

/** 
 * Validate input data 
 */
const validateInput = ({ ...params }) => {
  return new Promise((resolve, reject) => {

    if (!params.order instanceof Array || params.order.length === 0) {
      reject('Your order is in invalid format')
    }

    if (!params.userId) {
      reject('No userId')
    }

    params.order.forEach((item) => {
      if (!item.hasOwnProperty('productId') && !item.hasOwnProperty('quantity')) {
        reject('Your order has invalid array objects')
      }
    })

    resolve(params)
  })

}

/**
 * Find user information from id
 */
const findUser = async ({ ...params }) => {
  const user = await User.findOne(params.userId)
  if (!user) {
    throw new Error('User not found')
  }

  return { user: user, ...params }

}

/*
 * Populate order items with product information 
 */
const findProducts = async ({ ...params }) => {
  const productIds = params.order.map((item) => item.productId)
  const products = await Product.find({ id: productIds })

  if (products.length !== params.order.length) {
    throw new Error('Product(s) not listed')
  }

  const merged = products.map((item) => {
    item.quantity = params.order.find(e => item.id === e.productId).quantity
    return item
  })

  return { ...params, order: merged }

}

/**
 * Calulcate total price 
 */
const processOrder = ({ ...params }) => {
  const calculatePrice = {
    NO_SALE: (item) => {
      return item.quantity * item.price
    },

    PRICE_MOD: (item) => {
      return item.quantity * item.price * item.price_mod
    },

    PACKAGE: (item) => {
      const discount = Math.floor(item.quantity / item.package_get_count) * item.package_pay_count * item.price
      const remainder = (item.quantity % item.package_get_count) * item.price
      return discount + remainder
    },
  }

  const reducer = (accumelator, current) => accumelator + calculatePrice[current.on_sale](current)

  const orderDetails = {
    products: params.order.map((item) => {
      return {
        product: { name: item.name, id: item.id },
        quantity: item.quantity,
        sum: calculatePrice[item.on_sale](item),
      }
    }),
    user: params.user.id,
    total: params.order.reduce(reducer, 0)
  }

  return { orderDetails: orderDetails }

}

/**
 * Creates a new order
 */
const createOrder = async ({ orderDetails }) => {

  const result = await Order.create({
    user: orderDetails.user,
    total_price: orderDetails.total,
    order_details: orderDetails,
  })

  return result

}

module.exports = { create, confirm, dismiss }

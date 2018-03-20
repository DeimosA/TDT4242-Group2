const request = require('supertest')
const should = require('should')

describe('OrderController', () => {

  /* Wrap for request */
  const post = (url, data, code, cookie = '') => request(sails.hooks.http.app).post(url).set('Cookie', cookie).send(data).expect(code)
  const get = (url, code, cookie = '') => request(sails.hooks.http.app).get(url).set('Cookie', cookie).expect(code)
  const del = (url, data, code, cookie = '') => request(sails.hooks.http.app).delete(url).set('Cookie', cookie).send(data).expect(code)
  const put = (url, data, code, cookie = '') => request(sails.hooks.http.app).put(url).set('Cookie', cookie).send(data).expect(code)

  const api = {
    login: `/api/user/login`, // POST
    products: `/api/product`, // GET
    orders: (user) => `/api/order?populate=${user}&user_confirmed=true`, // GET ADMIN
    new: `/api/order`, // POST
    confirm: (id) => `/api/order/${id}/confirm`, // POST
    dismiss: (id) => `/api/order/${id}/dismiss`, // POST
  }

  const user = {
    email: 'test@test.com',
    password: 'test123test'
  }

  const code = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404
  }

  describe('New Order', () => {
    let cookie
    let products
    let orderId
    let userId

    // Get cookie
    it('should get cookie after login', async () => {
      await post(api.login, user, code.ok).then((res) => {
        should.exist(res.header['set-cookie']) // cookie
        cookie = res.headers['set-cookie']
      })
    })

    it('should get products', async () => {
      await get(api.products, code.ok).then((res) => {
        should.exist(res.body)
        res.body.should.be.an.Array()
        products = res.body
      })
    })

    it('should order!', async () => {
      const order = [{ productId: products[0].id, quantity: 2 }, { productId: products[1].id, quantity: 7 }]
      await post(api.new, order, code.created, cookie).then((res) => {
        should.exist(res.body)
        orderId = res.body.id
        userId = res.body.user
      })
    })

    it('should confirm order!', async () => {
      await post(api.confirm(orderId), {}, code.ok, cookie).then((res) => {
        should.exist(res.body)
      })
    })

    it('should dismiss order!', async () => {
      await post(api.dismiss(orderId), {}, code.ok, cookie).then((res) => {
        should.exist(res.body)
      })
    })

    it('should get orders!', async () => {
      await get(api.orders(userId), code.ok, cookie).then((res) => {
        should.exist(res.body)
      })
    })
  })
})

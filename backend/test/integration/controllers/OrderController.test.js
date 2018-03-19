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
    let order = [
      {
        productId: 1,
        quantity: 2,
      },
    ]

    // Get cookie
    it('should get cookie after login', async () => {
      await post(api.login, user, code.ok).then((res) => {
        should.exist(res.header['set-cookie']) // cookie
        cookie = res.headers['set-cookie']
      })
    })

    it('should get products', async () => {
      await post(api.new, order, {}, cookie).then((res) => {
        console.log(res.body)
        should.exist(res.body)
      })
    })
  })
})

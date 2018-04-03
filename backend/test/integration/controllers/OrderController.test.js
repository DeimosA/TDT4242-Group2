const request = require('supertest');
const should = require('should');

describe('OrderController', () => {

  const post = (url, data, code, cookie = '') =>
    request(sails.hooks.http.app).post(url).set('Cookie', cookie).send(data).expect(code);
  const get = (url, code, cookie = '') =>
    request(sails.hooks.http.app).get(url).set('Cookie', cookie).expect(code);
  const del = (url, data, code, cookie = '') =>
    request(sails.hooks.http.app).delete(url).set('Cookie', cookie).send(data).expect(code);
  const put = (url, data, code, cookie = '') =>
    request(sails.hooks.http.app).put(url).set('Cookie', cookie).send(data).expect(code);

  const api = {
    login: `/api/user/login`, // POST
    products: `/api/product`, // GET
    orders: (user) => `/api/order?populate=${user}&user_confirmed=true`, // GET ADMIN
    new: `/api/order`, // POST
    confirm: (id) => `/api/order/${id}/confirm`, // POST
    dismiss: (id) => `/api/order/${id}/dismiss`, // POST
    setStatus: (id) => `/api/order/${id}/setstatus`, // POST
  };

  const user = {
    email: 'test@test.com',
    password: 'test123test',
  };

  const code = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
  };

  describe('New Order', () => {
    let cookie;
    let products;
    let orderId;
    let userId;

    // Get cookie
    it('should get cookie after login', async () => {
      await post(api.login, user, code.ok).then((res) => {
        should.exist(res.header['set-cookie']); // cookie
        cookie = res.headers['set-cookie'];
      });
    });

    it('should get products', async () => {
      await get(api.products, code.ok).then((res) => {
        should.exist(res.body);
        res.body.should.be.an.Array();
        products = res.body;
      });
    });

    it('should order!', async () => {
      const order = [
        { productId: products[0].id, quantity: 2 },
        { productId: products[1].id, quantity: 7 },
      ];
      await post(api.new, order, code.created, cookie).then((res) => {
        should.exist(res.body);
        orderId = res.body.id;
        userId = res.body.user;
      });
    });

    it('should confirm order!', async () => {
      await post(api.confirm(orderId), {}, code.ok, cookie).then((res) => {
        should.exist(res.body);
      });
    });

    it('should dismiss order!', async () => {
      await post(api.dismiss(orderId), {}, code.ok, cookie).then((res) => {
        should.exist(res.body);
      });
    });

    it('should get orders!', async () => {
      await get(api.orders(userId), code.ok, cookie).then((res) => {
        should.exist(res.body);
      });
    });

    it('should order! again!', async () => {
      const order = [
        { productId: products[0].id, quantity: 2 },
        { productId: products[1].id, quantity: 7 },
      ];
      await post(api.new, order, code.created, cookie).then((res) => {
        should.exist(res.body);
        orderId = res.body.id;
        userId = res.body.user;
      });
      await post(api.confirm(orderId), {}, code.ok, cookie).then((res) => {
        should.exist(res.body);
      });
    });

    ['ACCEPTED', 'AWAITING_RESUPPLY', 'SHIPPED', 'CANCELLED'].forEach((orderStatus) => {
      it(`should change order status to ${orderStatus}`, (next) => {
        post(api.setStatus(orderId), { status: orderStatus }, code.ok, cookie).then(({ body }) => {
          should(body.status).equal(orderStatus);
          next();
        }).catch(next);
      });
    });

    ['sUperSTATus', 'Your package was sent yesterday', 'No, just no!'].forEach((orderStatus) => {
      it(`should NOT accept arbitrary status: ${orderStatus}`, (next) => {
        post(api.setStatus(orderId), { status: orderStatus }, code.badRequest, cookie).then(({ body }) => {
          should.exist(body.error);
          next();
        }).catch(next);
      });
    });

    it('should NOT change order status back to PENDING!', async () => {
      await post(api.setStatus(orderId), { status: 'PENDING' }, code.badRequest, cookie).then(({ body }) => {
        should.exist(body.error);
      });
    });

    it('should NOT change order status if not admin!', async () => {
      let newCookie;
      await post(api.login, { email: 'anothertest@test.com', password: 'test123test' }, code.ok).then(({ headers }) => {
        should.exist(headers['set-cookie']);
        newCookie = headers['set-cookie'];
      });
      await post(api.setStatus(orderId), { status: 'ACCEPTED' }, code.forbidden, newCookie).then(({ body }) => {
        should.exist(body.error);
      });
    });
  });
});

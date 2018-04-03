const request = require('supertest');
const should = require('should');

describe('ProductController', () => {

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
    create: `/api/product`, // POST admin
    product: (id) => `/api/product/${id}`, // GET
    update: (id) => `/api/product/${id}`, // PUT admin
    delete: (id) => `/api/product/${id}`, // DELETE admin
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

  describe('Products', () => {
    let products = { };

    it('should get products', async () => {
      await get(api.products, code.ok).then(({ body }) => {
        should.exist(body);
        body.should.be.an.Array();
        products = body;
      });
    });

    it('should get single product', async () => {
      const { id } = products[0];
      await get(api.product(id), code.ok).then(({ body }) => {
        should.exist(body.name); // product
      });
    });
  });

  describe('Admin', () => {
    let cookie;
    let product;

    describe('Normal', () => {

      it('should fail create new product', async () => {
        const newProduct = {
          name: 'new product',
          description: 'last',
          price: 99,
          manufacturer: 'jall',
        };
        await post(api.create, newProduct, code.unauthorized).then(({ body }) => {
          should.exist(body);
        });
      });

      it('should get cookie after login', async () => {
        await post(api.login, user, code.ok).then(({ headers }) => {
          should.exist(headers['set-cookie']);
          cookie = headers['set-cookie'];
        });
      });

      it('should create new product', async () => {
        const newProduct = {
          name: 'new product',
          description: 'last',
          price: 99,
          manufacturer: 'jall',
        };
        await post(api.create, newProduct, code.created, cookie).then(({ body }) => {
          should.exist(body.id);
          product = body;
        });
      });

      it('should update product', async () => {
        const { id } = product;
        const updatedProduct = { name: 'new name', description: 'yay', price: 13 };
        await put(api.update(id), updatedProduct, code.ok, cookie).then(({ body }) => {
          should.exist(body);
        });
      });

      it('should delete product', async () => {
        const { id } = product;
        await del(api.delete(id), {}, code.ok, cookie).then(({ body }) => {
          should.exist(body);
        });
      });
    });
  });
});

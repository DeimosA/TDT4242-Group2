const request = require('supertest');
const should = require('should');

describe('UserController', () => {

  const post = (url, data, code, cookie = '') =>
    request(sails.hooks.http.app).post(url).set('Cookie', cookie).send(data).expect(code);
  const get = (url, code, cookie = '') =>
    request(sails.hooks.http.app).get(url).set('Cookie', cookie).expect(code);

  const api = {
    register: `/api/user`, // POST
    users: `/api/user`, // GET, admin
    delete: (id) => `/api/user/${id}`,
    login: `/api/user/login`, // POST
    logout: `/api/user/logout`, // POST
    user: `/api/user/current`, // GET
    makeAdmin: (id) => `/api/user/${id}/makeadmin`, // POST, admin
    removeAdmin: (id) => `/api/user/${id}/removeadmin`, // POST, admin
  };

  const user = {
    email: 'test@test.com',
    password: 'test123test',
  };

  const newEmail = 'test2@test.com';
  const wrongPassword = 'wrong';

  const code = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
  };

  describe('Register', () => {

    it('should create user', async () => {
      await post(api.register, { ...user, email: newEmail }, code.created).then((res) => {
        should.exist(res.body.email);
      });
    });

    it('should fail create user, duplicate', async () => {
      const data = { ...user };
      await post(api.register, { ...data }, code.badRequest).then((res) => {
        should.exist(res.body.code);
      });
    });
  });

  describe('Login', () => {

    it('should fail login', async () => {
      const data = { ...user, password: wrongPassword };
      await post(api.login, data, code.unauthorized).then((res) => {
        should.exist(res.body.error);
      });
    });

    it('should login', async () => {
      await post(api.login, user, code.ok).then((res) => {
        should.exist(res.body.email);
      });
    });
  });


  describe('Auth', () => {
    let cookie;

    describe('Normal', () => {

      it('should get cookie after login', async () => {
        await post(api.login, user, code.ok).then(({ headers }) => {
          should.exist(headers['set-cookie']);
          cookie = headers['set-cookie'];
        });
      });

      it('should get user', async () => {
        await get(api.user, code.ok, cookie).then(({ body }) => {
          should.exist(body.email);
        });
      });

      it('should logout', async () => {
        await post(api.logout, {}, code.ok, cookie).then(({ text }) => {
          should.exist(text);
        });
      });
    });

    describe('Admin', () => {
      let users;

      it('should get cookie after login', async () => {
        await post(api.login, user, code.ok).then(({ headers }) => {
          should.exist(headers['set-cookie']);
          cookie = headers['set-cookie'];
        });
      });

      describe('get users', () => {
        it('should get users', async () => {
          await get(api.users, code.ok, cookie).then(({ body }) => {
            should.exist(body);
            body.should.be.an.Array();
            users = body;
          });
        });
      });

      describe('makeAdmin', () => {
        it('should make user admin', async () => {
          const { id } = users[2];
          await post(api.makeAdmin(id), {}, code.ok, cookie).then(({ body }) => {
            should.exist(body);
          });
        });
      });

      describe('removeAdmin', () => {
        it('should remove admin', async () => {
          const { id } = users[1];
          await post(api.removeAdmin(id), {}, code.ok, cookie).then(({ body }) => {
            should.exist(body);
          });
        });
      });
    });
  });
});

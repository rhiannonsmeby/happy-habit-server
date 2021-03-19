const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('Auth Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => helpers.cleanTables());

  afterEach('cleanup', () => helpers.cleanTables());

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => {
        return helpers.seedTestUsers(db, testUsers);
    })

    const requiredFields = ['user_name', 'password'];

    requiredFields.forEach((field) => {
      const loginBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      it(`responds with 404 error when ${field} is missing`, () => {
        delete loginBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginBody)
          .expect(400, {
            error: { message: `Missing ${field} in request body` },
          });
      });
    });

    it('responds with 400 and "invalid username or password" when login body contains fields, but user_name is not found in db', () => {
      const invalidUser = {
        user_name: 'bad username',
        password: testUser.password,
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUser)
        .expect(400, { error: { message: 'Incorrect username or password' } });
    });

    it('responds with 400 and "invalid username or password" when user_name exists, but password is wrong', () => {
      const invalidUserPass = {
        user_name: testUser.user_name,
        password: 'im a hacker',
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUserPass)
        .expect(400, { error: { message: 'Incorrect username or password' } });
    });

    it('responds with 200 and a JWT token when the credentials are valid in the database', () => {
      const validUser = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      // make a JWT token with the valid user to compare against

      const expectedToken = AuthService.makeJwt(validUser);

      return supertest(app)
        .post('/api/auth/login')
        .send(validUser)
        .expect(200, { token: expectedToken });
    });
  });
});
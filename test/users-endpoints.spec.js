const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

describe.only('Auth Endpoints', function () {
  let db;

  const { testUsers} = helpers.makeUsersArray;
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert users and fill tables', () => {
        return helpers.seedTestUsers(db, testUsers);
      });
      const requiredFields = [
        'user_name',
        'password',
      ];

      requiredFields.forEach((field) => {
        const registerAttempt = {
          user_name: 'madonna',
          password: 'materialgirl',
        };

        it(`responds with a 400 error when ${field} is missing`, () => {
          delete registerAttempt[field];
          return supertest(app)
            .post('/api/users')
            .send(registerAttempt)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });

      it('responds with 400 "Password must be longer than 8 characters" when empty password', () => {
        const shortPassUser = {
          user_name: 'madonna',
          password: 'girl',
        };

        return supertest(app)
          .post('/api/users')
          .send(shortPassUser)
          .expect(400, {
            error: { message: 'Password must be longer than 8 characters' },
          });
      });

      it('responds with 400 "Password must be shorter than 72 characters" when long password', () => {
        const longPassUser = {
          user_name: 'madonna',
          password: '*'.repeat(73),
        };

        return supertest(app)
          .post('/api/users')
          .send(longPassUser)
          .expect(400, {
            error: { message: 'Password must be less than 72 characters' },
          });
      });
      it('responds with 400 "Password cannot begin with a space" when space at beginning of password', () => {
        const spaceBeforePassUser = {
          user_name: 'madonna',
          password: ' materialgirl',
        };

        return supertest(app)
          .post('/api/users')
          .send(spaceBeforePassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 "Password cannot end with a space" when space at end of password', () => {
        const spaceAfterPassUser = {
          user_name: 'madonna',
          password: 'materialgirl ',
        };

        return supertest(app)
          .post('/api/users')
          .send(spaceAfterPassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 error when password isnt complex enough,', () => {
        const badPassUser = {
          user_name: 'madonna',
          password: 'materialgirl',
        };

        return supertest(app)
          .post('/api/users')
          .send(badPassUser)
          .expect(400, {
            error: {
              message:
                'Password must contain 1 upper case, lower case, number and special character',
            },
          });
      });
      it('responds with 400 error when username is already taken', () => {
        const takenPassUser = {
          user_name: testUser.user_name,
          password: 'materialgirl',
        };

        return supertest(app)
          .post('/api/users')
          .send(takenPassUser)
          .expect(400, {
            error: {
              message: 'Username already taken',
            },
          });
      });
    });

    context('Successful submission', () => {
      it('responds with 201, serialized user, storing bcrypt password', () => {
        const newUser = {
          user_name: 'test-user',
          password: 'P@sswor6',
        };

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body.user_name).to.eql(newUser.user_name);
            expect(response.body).to.not.have.property('password');
            expect(response.headers.location).to.eql(
              `/api/users/${response.body.id}`
            );
          })
          .expect((response) => {
            db.from('users')
              .select('*')
              .where({ id: response.body.id })
              .first()
              .then((row) => {
                expect(row.user_name).to.eql(newUser.user_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((isMatch) => {
                expect(isMatch).to.be.true;
              });
          });
      });
    });
  });
});

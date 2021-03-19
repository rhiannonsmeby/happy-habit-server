const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

describe.only('Auth Endpoints', function () {
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
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/user', () => {
    context('User Validation', () => {
      beforeEach('insert users and fill tables', () => {
        return helpers.seedUsers(db, testUsers);
      });
      const requiredFields = [
        'username',
        'password',
        'name',
      ];

      requiredFields.forEach((field) => {
        const registerAttempt = {
          username: 'madonna',
          password: 'materialgirl',
          name: 'Madonna',
        };

        it(`responds with a 400 error when ${field} is missing`, () => {
          delete registerAttempt[field];
          return supertest(app)
            .post('/api/user')
            .send(registerAttempt)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });

      it('responds with 400 "Password must be longer than 8 characters" when empty password', () => {
        const shortPassUser = {
          username: 'madonna',
          password: 'girl',
          name: 'Madonna',
        };

        return supertest(app)
          .post('/api/user')
          .send(shortPassUser)
          .expect(400, {
            error: { message: 'Password must be longer than 8 characters' },
          });
      });

      it('responds with 400 "Password must be shorter than 72 characters" when long password', () => {
        const longPassUser = {
          username: 'madonna',
          password: '*'.repeat(73),
          name: 'Madonna'
        };

        return supertest(app)
          .post('/api/user')
          .send(longPassUser)
          .expect(400, {
            error: { message: 'Password must be less than 72 characters' },
          });
      });
      it('responds with 400 "Password cannot begin with a space" when space at beginning of password', () => {
        const spaceBeforePassUser = {
          username: 'madonna',
          password: ' materialgirl',
          name: 'Madonna'
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceBeforePassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 "Password cannot end with a space" when space at end of password', () => {
        const spaceAfterPassUser = {
          username: 'madonna',
          password: 'materialgirl ',
          name: 'Madonna'
        };

        return supertest(app)
          .post('/api/user')
          .send(spaceAfterPassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 error when password isnt complex enough,', () => {
        const badPassUser = {
          username: 'madonna',
          password: 'materialgirl',
          name: 'Madonna'
        };

        return supertest(app)
          .post('/api/user')
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
          username: testUser.username,
          password: 'mAterialgirl97!',
          name: 'Madonna'
        };

        return supertest(app)
          .post('/api/user')
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
          username: 'test-user',
          password: 'P@sswor6',
          name: 'Test User'
        };

        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body.username).to.eql(newUser.username);
            expect(response.body).to.not.have.property('password');
            expect(response.headers.location).to.eql(
              `/api/user/${response.body.id}`
            );
          })
          .expect((response) => {
            db.from('user')
              .select('*')
              .where({ id: response.body.id })
              .first()
              .then((row) => {
                expect(row).to.eql(newUser.username);
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

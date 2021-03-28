const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Entry Endpoints', () => {
    let db;

    const {testUsers} = helpers.makeUsersArray()
    const testUser = testUsers
    const {testEntries} = helpers.makeEntriesArray()
    // const testEntry = testEntries[0]

    before('Make the knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after('disconnect from the database', () => db.destroy());

    before('clean the table', () => helpers.cleanTables());

    afterEach('cleanup', () => helpers.cleanTables());


    describe('GET /api/entry', () => {
        context('given there are no entries', () => {
            it('returns a 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/entry')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            })
        }) 

        context('given there are entries', () => {
            beforeEach('add entries', () => {
                return db
                    .into('entries')
                    .insert(testEntries)
            })

            it('returns a 200 and all entries', () => {
                return supertest(app)
                    .get('/api/entries')
                    .expect(200, testEntries)
            })
        })
    })
})
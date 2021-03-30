const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Entry Endpoints', () => {
    let db

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testEntries = helpers.makeEntriesArray(testUser)
    const testEntry = testEntries[0]
    
    before('Make the knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    });

    console.log(db)

    after('disconnect from the database', () => db.destroy())

    before('clean the table', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/entry', () => {
        const [usersEntry] = testEntries.filter(
            testEntry => testEntry.user_id === testUser.id
        )
        beforeEach('Seed users and entries', () => {
            return helpers.seedUsersEntries(
                db, 
                testUsers,
                testEntries,
            )
        })

        it('Returns a 200 and users entries', () => {
            return supertest(app)
                .get('/api/entry/')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200)
        });
    })

    describe(`POST /api/entry/`, () => {
        beforeEach('Seed users and entries', () => {
            return helpers.seedUsersEntries(
                db, 
                testUsers,
                testEntries,
            )
        })

        it('returns a 201 when new entry is added', () => {
            const newEntry = {
                date_created: '2029-01-22T16:28:32.615Z',
                end_mood: 5, 
                exercise: 'activity 10', 
                notes: 'notes on activity 10',
                start_mood: 1,
            }
            return supertest(app)
                .post('/api/entry')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newEntry)
                .expect(201)
                .expect(res => {
                    expect(res.body.date_created).to.eql(newEntry.date_created);
                    expect(res.body.end_mood).to.eql(newEntry.end_mood);
                    expect(res.body.exercise).to.eql(newEntry.exercise);
                    expect(res.body.notes).to.eql(newEntry.notes);
                    expect(res.body.start_mood).to.eql(newEntry.start_mood);
                    expect(res.body).to.have.property('id');
                })
        })
    })

    describe('DELETE /api/entry/:id', () => {
        context('When there are entries in the db', () => {
            beforeEach('Seed users and entries', () => {
                return helpers.seedUsersEntries(
                    db, 
                    testUsers,
                    testEntries,
                )
            });

            it('returns a 204 and the entry is not in the request', () => {
                const idToRemove = 2;
                const expectedArray = testEntries.filter(entry => entry.id !== idToRemove);

                return supertest(app)
                    .delete(`/api/entry/${idToRemove}`)
                    .expect(204)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
            });
        });
    });
})
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Entry Endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testEntries = helpers.makeEntriesArray(testUser)
    const testEntry = testEntries[0]
    
    before('Make the knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db);
    });
    after('disconnect from the database', () => db.destroy())

    before('clean the table', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))
})
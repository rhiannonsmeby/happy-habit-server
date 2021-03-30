const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  })
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
    },
  ]
}

/**
 * generate fixtures of entried for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(entries)} - arrays of entries
 */

function makeEntriesArray(user) {
  return [
    {
      user_id: user.id, 
      date_created: '2029-01-22T16:28:32.615Z',
      end_mood: 5, 
      exercise: 'activity 1', 
      id: 1,
      notes: 'notes on activity 1',
      start_mood: 1, 
    }, 
    {
      id: 2,
      user_id: user.id, 
      exercise: 'activity 2', 
      start_mood: 1, 
      end_mood: 3, 
      notes: 'notes on activity 2',
      date_created: '2029-01-22T16:28:32.615Z',
    }, 
    {
      id: 3,
      user_id: user.id, 
      exercise: 'activity 3', 
      start_mood: 1, 
      end_mood: 5, 
      notes: 'notes on activity 3',
      date_created: '2029-01-22T16:28:32.615Z',
    }, 
    {
      id: 4,
      user_id: user.id, 
      exercise: 'activity 4', 
      start_mood: 1, 
      end_mood: 5, 
      notes: 'notes on activity 4',
      date_created: '2029-01-22T16:28:32.615Z',
    }, 
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "entry",
        "user"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('user_id_seq', 0)`),
        ])
      )
  )
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers)
    
    await trx.raw(
        `SELECT setval('user_id_seq', ?)`,
        [users[users.length - 1].id],
    )
    })
}

async function seedUsersEntries(db, users, entry) {
  await seedUsers(db, users)

    await db.transaction(async trx => {
      await trx.into('entry').insert(entry);
      await Promise.all ([
        trx.raw(
          `SELECT setval('entry_id_seq', ?)`,
          [entry[entry.length - 1].id],
        ),
      ])
    })
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeEntriesArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedUsersEntries,
}
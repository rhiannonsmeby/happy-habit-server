const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'demo_user',
            password: 'Password1!',
        },
        {
            id: 2,
            user_name: 'another_user',
            password: 'Password1!',
        },
        {
            id: 3,
            user_name: 'that_user',
            password: 'Password1!',
        },
        {
            id: 4,
            user_name: 'one_user',
            password: 'Password1!',
        },
    ]
}

function makeEntriesArray() {
    return [
        {
            id: 1,
            assigned_user: 1,
            exercise: 'journaling',
            start_mood: 2,
            end_mood: 5, 
            notes: 'Today I wrote about gratitude; feeling a lot better',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            assigned_user: 1,
            exercise: 'walk a mile',
            start_mood: 3,
            end_mood: 4, 
            notes: 'Being outside for a while was so nice',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            assigned_user: 2,
            exercise: 'made a healthy snack',
            start_mood: 2,
            end_mood: 5, 
            notes: '',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            assigned_user: 3,
            exercise: 'bike ride',
            start_mood: 2,
            end_mood: 5, 
            notes: 'I saw kittens in the woods during my bike ride',
            date_created: '2022-11-22T16:28:32.615Z',
        },
        {
            id: 5,
            assigned_user: 1,
            exercise: 'meditation',
            start_mood: 2,
            end_mood: 5, 
            notes: '',
            date_created: '2023-01-29T17:45:32.615Z',
        },
    ]
}

function cleanTables(db) {
    return db.raw(
        'TRUNCATE users, entries RESTART IDENTITY CASCADE'
    )
}

function seedTestUsers(db, users) {
    const testUsers = users.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1),
    }))
    return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db.raw(
                `SELECT setval('users_id_seq', ?)`,
                users[users.length - 1].id
            );
        });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    });
  
    return `Bearer ${token}`;
  }
  
  module.exports = {
    makeUsersArray,  
    makeUsersArray,
    cleanTables,
    seedTestUsers,
    makeAuthHeader,
  };
const EntryService = {
    getAllEntries(knex) {
        return knex.select('*').from('entry')
    },
    insertEntry(knex, newEntry) {
        return knex
            .insert(newEntry)
            .into('entry')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('entry')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteEntry(knex, id) {
        return knex('entry')
            .from('entry')
            .where({id})
            .first()
    },
    updateEntry(knex, id, updateEntry) {
        return knex('entry')
            .from('entry')
            .where({id})
            .update(updateEntry)
    },
}

module.exports = EntryService
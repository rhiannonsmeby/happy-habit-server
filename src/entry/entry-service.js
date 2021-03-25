const EntryService = {
    getAllEntries(knex) {
        return knex
            .select('*')
            .from('entry')
    },
    getById(knex, id) {
        return knex
            .from('entry')
            .select('*')
            .where('id', id)
            .first()
    },
    addEntry(knex, newEntry) {
        return knex
            .insert(newEntry)
            .into('entry')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteEntry(knex, id) {
        return knex('entry')
            .from('entry')
            .where({id})
            .delete()
    },
    updateEntry(knex, id, updateEntry) {
        return knex('entry')
            .from('entry')
            .where({id})
            .update(updateEntry);
    },
}

module.exports = EntryService
const EntriesService = {
    getAllEntries(knex) {
        return knex.select('*').from('entries')
    },
    insertEntries(knex, newEntries) {
        return knex
            .insert(newEntries)
            .into('entries')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('entries')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteEntries(knex, id) {
        return knex('entries')
            .from('entries')
            .where({id})
            .first()
    },
    updateEntries(knex, id, updateEntries) {
        return knex('entries')
            .from('entries')
            .where({id})
            .update(updateEntries)
    },
}

module.exports = EntriesService
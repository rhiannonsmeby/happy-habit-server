const EntryService = {
    getUsersEntries(db, user_id) {
        return db
            .select('*')
            .from('entry')
            .where({user_id})
    },
    getById(db, id) {
        return db
            .select('*')
            .from('entry')
            .where({id})
            .first()
    },
    addEntry(db, newEntry) {
        return db
            .insert(newEntry)
            .into('entry')
            .returning('*')
            .then(([entry]) => {
                return entry
            })
            .then((entry) => this.getById(knex, entry.id))
    },
    deleteEntry(db, id) {
        return db('entry')
            .where({id})
            .delete()
    },
    updateEntry(db, id, updateEntry) {
        return db('entry')
            .where({id})
            .update(updateEntry);
    },
}

module.exports = EntryService
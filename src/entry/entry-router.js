const path = require('path')
const express = require('express')
const EntryService = require('./entry-service')
const { requireAuth } = require('../middleware/jwt-auth')
const {join} = require('path')

const entryRouter = express.Router()
const jsonParser = express.json()

const serializeEntry = entry => ({
    //assigned_user, exercise, start_mood, end_mood, notes
    id: entry.id,
    assigned_user: entry.assigned_user,
    exercise: entry.exercise,
    start_mood: entry.start_mood,
    end_mood: entry.end_mood,
    notes: entry.notes,
    date_created: entry.date_created,
})

entryRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        EntryService.getAllEntries(knexInstance)
            .then(entry => {
                res.json(entry.map(serializeEntry))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {exercise, start_mood, end_mood} = req.body
        const newEntry = {exercise, start_mood, end_mood}

        for (const [key, value] of Object.entries(newEntry)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        EntryService.insertEntry(knexInstance, newEntry)
            .then(entry => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/entry/${entry.id}`))
                    .json(serializeEntry(entry))
            })
            .catch(next)
    })
    entryRouter
        .route('/:id')
        .all(requireAuth)
        .all((req, res, next) => {
            EntryService.getById(
                req.app.get('db'),
                req.params.id
            )
            .then(entry => {
                if (!entry) {
                    return res.status(404).json({
                        error: {message: `Entry does not exist`}
                    })
                }
                res.entry = entry
                next()
            })
        })
        .get((req, res, next) => {
            res.json(serializeEntry(res.entry))
        })
        .delete((req, res, next) => {
            EntryService.deleteEntry(
                req.app.get('db'),
                req.params.id
            )
                .then((numRowsAffected) => {
                    res.status(404).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const {notes} = req.body
            const entryToUpdate = {notes}

            constnumberOfValues = Object.values(entryToUppdate).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: {
                        message: `Request body must contain 'notes'`
                    }
                })
            }

            EntryService.updateEntry(
                req.app.get('db'),
                req.params.id,
                entryToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })

        module.exports = entryRouter
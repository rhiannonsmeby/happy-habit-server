const path = require('path')
const express = require('express')
const EntriesService = require('./entries-service')
const {join} = require('path')

const entriesRouter = express.Router()
const jsonParser = express.json()

const serializeEntries = entries => ({
    //assigned_user, exercise, start_mood, end_mood, notes
    id: entries.id,
    assigned_user: entries.assigned_user,
    exercise: entries.exercise,
    start_mood: entries.start_mood,
    end_mood: entries.end_mood,
    notes: entries.notes,
})

entriesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        EntriesService.getAllEntries(knexInstance)
            .then(entries => {
                res.json(entries.map(serializeEntries))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {exercise, start_mood, end_mood} = req.body
        const newEntries = {exercise, start_mood, end_mood}

        for (const [key, value] of Object.entries(newEntries)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        EntriesService.insertEntries(knexInstance, newEntries)
            .then(entries => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/entries/${entries.id}`))
                    .json(serializeEntries(entries))
            })
            .catch(next)
    })
    entriesRouter
        .route('/:id')
        .all((req, res, next) => {
            EntriesService.getById(
                req.app.get('db'),
                req.params.id
            )
            .then(entries => {
                if (!entries) {
                    return res.status(404).json({
                        error: {message: `Entry does not exist`}
                    })
                }
                res.entries = entries
                next()
            })
        })
        .get((req, res, next) => {
            res.json(serializeEntries(res.entries))
        })
        .delete((req, res, next) => {
            EntriesService.deleteEntries(
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
            const entriesToUpdate = {notes}

            constnumberOfValues = Object.values(summaryToUppdate).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: {
                        message: `Request body must contain 'notes'`
                    }
                })
            }

            EntriesService.updateEntries(
                req.app.get('db'),
                req.params.id,
                entriesToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })

        module.exports = entriesRouter
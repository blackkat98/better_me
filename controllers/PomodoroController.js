const User = require('../models/User')
const Pomodoro = require('../models/Pomodoro')
const mongoose = require('mongoose')

const PomodoroSerializer = require('../model_serializers/Pomodoro')

const responseFormatter = require('../utils/response_formatter')
const pomodoro = require('../routes/api/pomodoro')

class PomodoroController
{
    async list(req, res, next) {
        let page = req.query.page || 1
        let perPage = req.query.per_page || 5
        perPage = perPage >= 5 && perPage <= 200 ? perPage : 5

        try {
            let pomodoros = await Pomodoro.paginate({
                userId: req.userFromJwt.id,
            }, {
                page: page,
                limit: perPage,
            })

            return res.status(200).json(responseFormatter(true, 200, '', PomodoroSerializer.pagination(pomodoros), {}))
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }
    }

    async show(req, res, next) {
        let id = req.params.id
        let pomodoro = null

        try {
            pomodoro = await Pomodoro.findById(id)

            if (!pomodoro || pomodoro.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }

            return res.status(200).json(responseFormatter(true, 200, '', PomodoroSerializer.single(pomodoro), {}))
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }
    }

    async store(req, res, next) {
        let inputs = req.body
        let data = {
            userId: req.userFromJwt.id,
            name: inputs.name,
            goal: inputs.goal,
            phases: [],
            status: inputs.status,
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            let pomodoro = await Pomodoro.create(data)

            if (!pomodoro) {
                throw new Error('Failed to create a Pomodoro')
            }

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully created'), PomodoroSerializer.single(pomodoro), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to create')))
        }
    }

    async update(req, res, next) {
        let id = req.params.id
        let inputs = req.body
        let pomodoro = null

        try {
            pomodoro = await Pomodoro.findById(id)

            if (!pomodoro || pomodoro.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            pomodoro.name = inputs.name
            pomodoro.goal = inputs.goal
            pomodoro.phases = inputs.phases || []
            pomodoro.status = inputs.status
            pomodoro = await pomodoro.save()

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully updated'), PomodoroSerializer.single(pomodoro), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to update')))
        }
    }

    async delete(req, res, next) {
        let id = req.params.id
        let pomodoro = null

        try {
            pomodoro = await Pomodoro.findById(id)

            if (!pomodoro || pomodoro.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            await pomodoro.delete()

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully deleted'), PomodoroSerializer.single(pomodoro), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to delete')))
        }
    }
}

module.exports = PomodoroController

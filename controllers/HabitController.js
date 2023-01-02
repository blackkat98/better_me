const User = require('../models/User')
const Habit = require('../models/Habit')
const HabitLog = require('../models/HabitLog')
const mongoose = require('mongoose')

const HabitSerializer = require('../model_serializers/Habit')

const responseFormatter = require('../utils/response_formatter')

class HabitController
{
    async list(req, res, next) {
        let page = req.query.page || 1
        let perPage = req.query.per_page || 5
        perPage = perPage >= 5 && perPage <= 200 ? perPage : 5

        try {
            let habits = await Habit.paginate({
                userId: req.userFromJwt.id,
            }, {
                page: page,
                limit: perPage,
            })

            return res.status(200).json(responseFormatter(true, 200, '', HabitSerializer.pagination(habits), {}))
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }
    }

    async show(req, res, next) {
        let id = req.params.id
        let habit = null

        try {
            habit = await Habit.findById(id)

            if (!habit || habit.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }

            return res.status(200).json(responseFormatter(true, 200, '', HabitSerializer.single(habit), {}))
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
            description: inputs.description || '',
            timeRepetition: inputs.timeRepetition,
            dateRepetition: inputs.dateRepetition,
            dateType: inputs.dateType,
            goal: inputs.goal,
            layout: inputs.layout,
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            let habit = await Habit.create(data)

            if (!habit) {
                throw new Error('Failed to create a Habit')
            }

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully created'), HabitSerializer.single(habit), {}))
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
        let habit = null

        try {
            habit = await Habit.findById(id)

            if (!habit || habit.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            habit.name = inputs.name
            habit.description = inputs.description || ''
            habit.timeRepetition = inputs.timeRepetition
            habit.dateRepetition = inputs.dateRepetition
            habit.dateType = inputs.dateType
            habit.goal = inputs.goal
            habit.layout = inputs.layout
            habit = await habit.save()

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully updated'), HabitSerializer.single(habit), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to update')))
        }
    }

    async delete(req, res, next) {
        let id = req.params.id
        let habit = null

        try {
            habit = await Habit.findById(id)

            if (!habit || habit.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            await habit.delete()

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully deleted'), HabitSerializer.single(habit), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to delete')))
        }
    }
}

module.exports = HabitController

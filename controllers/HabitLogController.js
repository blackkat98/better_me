const User = require('../models/User')
const Habit = require('../models/Habit')
const HabitLog = require('../models/HabitLog')
const mongoose = require('mongoose')

const HabitLogSerializer = require('../model_serializers/HabitLog')

const responseFormatter = require('../utils/response_formatter')

class HabitLogController
{
    async list(req, res, next) {
        let habitId = req.params.habitId
        let habit = null

        try {
            habit = await Habit.findById(habitId)

            if (!habit || habit.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        let page = req.query.page || 1
        let perPage = req.query.per_page || 5
        perPage = perPage >= 5 && perPage <= 200 ? perPage : 5

        try {
            let habitLogs = await HabitLog.paginate({
                habitId: habitId,
            }, {
                page: page,
                limit: perPage,
            })

            return res.status(200).json(responseFormatter(true, 200, '', HabitLogSerializer.pagination(habitLogs), {}))
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }
    }

    async store(req, res, next) {
        let habitId = req.params.habitId
        let habit = null

        try {
            habit = await Habit.findById(habitId)

            if (!habit || habit.userId != req.userFromJwt.id) {
                return res.status(404).json(responseFormatter(false, 404, req.t('Not found')))
            }
        } catch (err) {
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('An unexpected error occurred')))
        }

        let inputs = req.body
        let data = {
            userId: req.userFromJwt.id,
            habitId: habit.id,
            result: inputs.result,
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            let habitLog = await HabitLog.create(data)

            if (!habitLog) {
                throw new Error('Failed to create a Habit Log')
            }

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Successfully created'), HabitLogSerializer.single(habitLog), {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(500).json(responseFormatter(false, 500, req.t('Failed to create')))
        }
    }


}

module.exports = HabitLogController

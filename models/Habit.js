const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const User = require('./User')
const ObjectId = require('mongoose').Types.ObjectId

const habitConstants = require('../constants/habit')

const schema = {
    userId: {
        type: ObjectId, ref: 'User', require: true,
    },
    name: {
        type: String, require: true, maxLength: 255,
    },
    description: {
        type: String, require: false, maxLength: 1000,
    },
    timeRepetition: {
        type: Array, require: false,
    },
    dateRepetition: {
        type: Array, require: false,
    },
    dateType: {
        type: String, require: true, enum: habitConstants.dateTypes,
    },
    goal: {
        type: Object, require: true,
    },
    layout: {
        type: Object, require: true,
    },
}

const model = new mongoose.Schema(schema, { timestamps: true, })
model.plugin(mongoosePaginate)
const Habit = mongoose.models.Habit || mongoose.model('Habit', model)

module.exports = Habit

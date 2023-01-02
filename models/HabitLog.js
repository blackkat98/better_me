const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Habit = require('./User')
const ObjectId = require('mongoose').Types.ObjectId

const schema = {
    userId: {
        type: ObjectId, ref: 'User', require: true,
    },
    habitId: {
        type: ObjectId, ref: 'Habit', require: true,
    },
    // status: {
    //     type: String, require: true, maxLength: 255,
    // },
    result: {
        type: Object, require: true,
    },
}

const model = new mongoose.Schema(schema, { timestamps: true, })
model.plugin(mongoosePaginate)
const HabitLog = mongoose.models.Habit || mongoose.model('HabitLog', model)

module.exports = HabitLog

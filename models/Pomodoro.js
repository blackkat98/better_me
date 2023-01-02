const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const User = require('./User')
const ObjectId = require('mongoose').Types.ObjectId

const schema = {
    userId: {
        type: ObjectId, ref: 'User', require: true,
    },
    name: {
        type: String, require: true, maxLength: 255,
    },
    goal: {
        type: Object, require: true,
    },
    phases: {
        type: Array, default: [],
    },
    status: {
        type: String, require: true, maxLength: 255,
    },
}

const model = new mongoose.Schema(schema, { timestamps: true, })
model.plugin(mongoosePaginate)
const Pomodoro = mongoose.models.Pomodoro || mongoose.model('Pomodoro', model)

module.exports = Pomodoro

const mongoose = require('mongoose')
const Pomodoro = require('./User')
const ObjectId = require('mongoose').Types.ObjectId

const schema = {
    userId: {
        type: ObjectId, ref: 'User', require: true,
    },
    pomodoroId: {
        type: ObjectId, ref: 'Pomodoro', require: true,
    },
    status: {
        type: String, require: true, maxLength: 255,
    },
    duration: {
        type: Number, require: true, min: 300, max: 1800,
    },
    result: {
        type: Object, require: true,
    },
}

const PomodoroLog = mongoose.models.PomodoroLog || mongoose.model('PomodoroLog', new mongoose.Schema(schema, { timestamps: true, }))
module.exports = PomodoroLog

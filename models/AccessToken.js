const mongoose = require('mongoose')
const User = require('./User')
const ObjectId = require('mongoose').Types.ObjectId

const moment = require('moment')
const tokenLifespan = process.env.ACCESS_TOKEN_LIFESPAN || 7 // hours

const schema = {
    userId: {
        type: ObjectId, ref: 'User', require: true,
    },
    accessToken: {
        type: String, unique: true, required: true,
    },
    refreshToken: {
        type: String, unique: true, required: true,
    },
    expiredAt: {
        type: Date, default: () => { moment().add(tokenLifespan, 'hour') },
    },
}

const AccessToken = mongoose.models.AccessToken || mongoose.model('AccessToken', new mongoose.Schema(schema, { timestamps: true, }))
module.exports = AccessToken

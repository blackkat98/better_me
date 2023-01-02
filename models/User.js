const mongoose = require('mongoose')

const schema = {
    username: {
        type: String, unique: true, required: true, maxLength: 255,
    },
    email: {
        type: String, unique: true, sparse: true, maxLength: 255,
    },
    emailVerified: {
        type: Boolean, default: false,
    },
    password: {
        type: String, required: true, select: false,
    },
    name: {
        type: String, maxLength: 255,
    },
    avatar: {
        type: String, maxLength: 1000,
    },
    lang: {
        type: String, default: 'en',
    },
    timezone: {
        type: String, default: 'UTC',
    },
    oauthType: {
        type: String, default: null,
    },
    oauthId: {
        type: String, default: null,
    },
    deletedAt: {
        type: Date, default: null,
    },
}

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema(schema, { timestamps: true, }))
module.exports = User

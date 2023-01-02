const User = require('../models/User')
const AccessToken = require('../models/AccessToken')
const mongoose = require('mongoose')

const jwtHandler = require('../utils/jwt_handler')

const responseFormatter = require('../utils/response_formatter')
const moment = require('moment')

module.exports = async (req, res, next) => {
    let tokenCarrier = req.header('Authorization') || ''
    let tokenCarrierParts = tokenCarrier.split(' ')

    if (!tokenCarrier || tokenCarrierParts.length !== 2 || (tokenCarrierParts.length === 2 && tokenCarrierParts[0] !== 'Bearer')) {
        return res.status(401).json(responseFormatter(false, 401, req.t('Unauthenticated')))
    }

    let token = tokenCarrierParts[1]
    let validAccessToken = await AccessToken.findOne({
        accessToken: token,
        expiredAt: {
            $gt: moment(),
        },
    })

    if (!validAccessToken) {
        return res.status(401).json(responseFormatter(false, 401, req.t('Unauthenticated')))
    }

    let tokenData = await jwtHandler.decodeAccessToken(token)
    let userId = tokenData && tokenData.payload && tokenData.payload.id || null

    if (!userId) {
        return res.status(401).json(responseFormatter(false, 401, req.t('Unauthenticated')))
    }

    let user = await User.findOne({
        _id: userId,
    })

    if (!user) {
        return res.status(401).json(responseFormatter(false, 401, req.t('Unauthenticated')))
    }

    req.userFromJwt = user
    req.i18n.changeLanguage(user.lang || 'en')

    return next()
}

const User = require('../models/User')
const AccessToken = require('../models/AccessToken')
const mongoose = require('mongoose')

const bcryptor = require('../utils/bcryptor')
const responseFormatter = require('../utils/response_formatter')

const jwtHandler = require('../utils/jwt_handler')
const tokenLifespan = process.env.ACCESS_TOKEN_LIFESPAN || 7

const emailRegexCheck = require('../utils/email_regex_check')
const moment = require('moment')

const UserSerializer = require('../model_serializers/User')
const AccessTokenSerializer = require('../model_serializers/AccessToken')

class AuthController
{
    async register(req, res) {
        let inputs = req.body
        let username = inputs.username || null
        let email = inputs.email || null
        let password = inputs.password || null

        let existingUser = null

        if (username) {
            existingUser = await User.findOne({
                username: username,
            })

            if (existingUser) {
                return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} already in use', {
                    field: req.t('Username'),
                })))
            }
        }

        if (email) {
            existingUser = await User.findOne({
                email: email,
            })

            if (existingUser) {
                return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} already in use', {
                    field: req.t('Username'),
                })))
            }

            username = username || email.split('@').join('-')
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            
            let user = await User.create({
                username: username,
                email: email,
                password: bcryptor.encrypt(password),
            })

            if (!user) {
                throw new Error('Failed to create a User')
            }

            let accessToken = await (new AuthController()).createAccessTokenObject(user)

            if (!accessToken) {
                throw new Error('Failed to create an Access Token')
            }

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json(responseFormatter(true, 200, req.t('Registration succeeded'), {
                user: UserSerializer.single(user),
                accessToken: AccessTokenSerializer.single(accessToken),
            }, {}))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return res.status(401).json(responseFormatter(false, 401, req.t('Registration failed')))
        }
    }

    async login(req, res) {
        let inputs = req.body
        let username = inputs.username || null
        // let email = inputs.email || null
        let password = inputs.password || null

        let user = null

        if (emailRegexCheck(username)) {
            user = await User.findOne({
                email: username,
            }, '+password')
        } else {
            user = await User.findOne({
                username: username,
            }, '+password')
        }

        if (!user || (user && !bcryptor.compare(password, user.password))) {
            return res.status(401).json(responseFormatter(false, 401, req.t('These credentials do not match our records')))
        }

        try {
            let accessToken = await (new AuthController()).createAccessTokenObject(user)

            if (!accessToken) {
                throw new Error('Failed to create an Access Token string')
            }

            return res.status(200).json(responseFormatter(true, 200, req.t('Login succeeded'), {
                user: UserSerializer.single(user),
                accessToken: AccessTokenSerializer.single(accessToken),
            }, {}))
        } catch (err) {
            console.error(err)

            return res.status(401).json(responseFormatter(false, 401, req.t('Login failed')))
        }
    }

    async performOauth(oauthType, oauthId, data) {
        let existingUser = await (new AuthController()).findByOauthInformation(oauthType, oauthId, data)
        let result = null

        if (existingUser) {
            result = await (new AuthController()).signInWithOauthData(existingUser, oauthType, oauthId, data)
        } else {
            result = await (new AuthController()).signUpWithOauthData(oauthType, oauthId, data)
        }

        return result
    }

    async createAccessTokenObject(user) {
        let token = await (new AuthController()).generateAccessToken(user)
        let refreshToken = await (new AuthController()).generateRefreshToken()

        if (!token || !refreshToken) {
            throw new Error('Failed to create an Access Token object')
        }

        try {
            let accessToken = await AccessToken.create({
                userId: user._id,
                accessToken: token,
                refreshToken: refreshToken,
                expiredAt: moment().add(tokenLifespan, 'hour'),
            })

            return accessToken
        } catch (err) {
            console.error(err)
            throw new Error('Failed to create an Access Token object')
        }
    }

    async generateAccessToken(user) {
        return await jwtHandler.encodeAccessToken(user)
    }

    async generateRefreshToken() {
        return await jwtHandler.makeRefreshToken()
    }

    async findByOauthInformation(oauthType, oauthId, data) {
        const oauthIdentifierConditions = {
            oauthType: oauthType,
            oauthId: oauthId,
        }
        let userInfoConditions = null

        switch (oauthType) {
            case 'google':
                userInfoConditions = {
                    email: data.email,
                }
                break
        }

        return await User.findOne({
            $or: [
                oauthIdentifierConditions,
                userInfoConditions,
            ]
        })
    }

    async signUpWithOauthData(oauthType, oauthId, data) {
        let insertData = {
            password: bcryptor.encrypt(process.env.USER_DEFAULT_PASSWORD || 'BetterMe2022@'),
            oauthType: oauthType,
            oauthId: oauthId,
        }

        switch (oauthType) {
            case 'google':
                insertData.username = data.email.split('@').join('-')
                insertData.email = data.email
                insertData.name = data.name
                insertData.avatar = data.picture
                break
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            
            let user = await User.create(insertData)

            if (!user) {
                throw new Error('Failed to create a User')
            }

            let accessToken = await (new AuthController()).createAccessTokenObject(user)

            if (!accessToken) {
                throw new Error('Failed to create an Access Token')
            }

            await session.commitTransaction()
            session.endSession()

            return {
                success: true,
                data: {
                    user: UserSerializer.single(user),
                    accessToken: AccessTokenSerializer.single(accessToken),
                }
            }
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return {
                success: false,
                data: {
                    user: null,
                    accessToken: null,
                }
            }
        }
    }

    async signInWithOauthData(user, oauthType, oauthId, data) {
        switch (oauthType) {
            case 'google':
                user.oauthType = oauthType
                user.oauthId = oauthId
                user.name = data.name
                user.avatar = data.picture
                break
        }

        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            
            user = await user.save()

            let accessToken = await (new AuthController()).createAccessTokenObject(user)

            if (!accessToken) {
                throw new Error('Failed to create an Access Token')
            }

            await session.commitTransaction()
            session.endSession()

            return {
                success: true,
                data: {
                    user: UserSerializer.single(user),
                    accessToken: AccessTokenSerializer.single(accessToken),
                }
            }
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            console.error(err)

            return {
                success: false,
                data: {
                    user: null,
                    accessToken: null,
                }
            }
        }
    }
}

module.exports = AuthController

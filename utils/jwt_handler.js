const jwt = require('jsonwebtoken')
const promisify = require('util').promisify

const createJwtToken = promisify(jwt.sign).bind(jwt)
const verifyJwtToken = promisify(jwt.verify).bind(jwt)

const randToken = require('rand-token')

const tokenHashAlgorithm = process.env.ACCESS_TOKEN_ALGO || 'HS256'
const tokenSecret = process.env.ACCESS_TOKEN_SECRET || 'AccessTokenSecret'
const tokenLifespan = process.env.ACCESS_TOKEN_LIFESPAN || 7
const refreshTokenLength = process.env.REFRESH_TOKEN_LENGTH || 128

module.exports = {
    encodeAccessToken: async (user) => {
        const data = {
            id: user._id,
        }

        try {
            return await createJwtToken(
                {
                    payload: data,
                },
                tokenSecret,
                {
                    algorithm: tokenHashAlgorithm,
                    expiresIn: tokenLifespan + 'h',
                }
            )
        } catch (err) {
            console.error(err)
            return null
        }
    },
    decodeAccessToken: async (token) => {
        try {
            return await verifyJwtToken(token, tokenSecret)
        } catch (err) {
            console.error(err)
            return null
        }
    },
    makeRefreshToken: async () => {
        return await randToken.generate(refreshTokenLength)
    },
}

const Serializer = require('./Serializer')

class AccessTokenSerializer extends Serializer
{
    static single(token) {
        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            createdAt: token.createdAt,
            expiredAt: token.expiredAt,
        }
    }
}

module.exports = AccessTokenSerializer

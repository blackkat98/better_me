const Serializer = require('./Serializer')

class UserSerializer extends Serializer
{
    static single(user) {
        return {
            id: user.id,
            username: user.username,
            name: user.name || null,
            email: user.email || null,
            avatar: user.avatar || null,
            lang: user.lang || 'en',
            timezone: user.timezone || 'UTC',
            oauthType: user.oauthType || null,
            oauthId: user.oauthId || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }
    }
}

module.exports = UserSerializer

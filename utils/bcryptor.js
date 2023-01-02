var bcrypt = require('bcrypt')

module.exports = {
    encrypt: (string) => {
        let salt = bcrypt.genSaltSync()

        return bcrypt.hashSync(string, salt)
    },
    compare: (string, encryptedString) => {
        return bcrypt.compareSync(string, encryptedString)
    },
}

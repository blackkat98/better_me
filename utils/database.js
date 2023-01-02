const mongoose = require('mongoose')

const connectToDb = (driver, host, port, dbName, username, password) => {
    const credential = username ? `${username}:${password}@` : ''
    const dbUri = `${driver}://${credential}${host}:${port}/${dbName}`

    switch (driver) {
        case 'mongodb':
            return mongoose.connect(dbUri)
        default:
            throw new Error('Unsupported DB driver')
    }
}

const connectionPool = {
    system: connectToDb(
        process.env.DB_CONNECTION,
        process.env.DB_HOST,
        process.env.DB_PORT,
        process.env.DB_DATABASE,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD
    ),
}

module.exports = connectionPool

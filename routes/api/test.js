const AuthMiddleware = require('../../middlewares/Auth')

module.exports = (app, multipartParser) => {
    app.get('/test', [ AuthMiddleware ], (req, res, next) => {
        res.status(200).json({
            data: 'test',
        })
    })
}

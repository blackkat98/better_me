const HabitLogController = require('../../controllers/HabitLogController')
const habitLogController = new HabitLogController()

const AuthMiddleware = require('../../middlewares/Auth')

module.exports = (app, multipartParser) => {
    app.get('/habits/:habitId', [ AuthMiddleware, ], habitLogController.list)
    app.post('/habits/:habitId', [ AuthMiddleware, ], habitLogController.store)
}

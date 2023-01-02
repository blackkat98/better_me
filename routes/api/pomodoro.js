const PomodoroController = require('../../controllers/PomodoroController')
const pomodoroController = new PomodoroController()

const AuthMiddleware = require('../../middlewares/Auth')

module.exports = (app, multipartParser) => {
    app.get('/pomodoros', [ AuthMiddleware, ], pomodoroController.list)
    app.get('/pomodoros/:id', [ AuthMiddleware, ], pomodoroController.show)
    app.post('/pomodoros', [ AuthMiddleware, ], pomodoroController.store)

    app.delete('/pomodoros/:id', [ AuthMiddleware, ], pomodoroController.delete)
}

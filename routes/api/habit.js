const HabitController = require('../../controllers/HabitController')
const habitController = new HabitController()

const AuthMiddleware = require('../../middlewares/Auth')

module.exports = (app, multipartParser) => {
    app.get('/habits', [ AuthMiddleware, ], habitController.list)
    app.get('/habits/:id', [ AuthMiddleware, ], habitController.show)
    app.post('/habits', [ AuthMiddleware, ], habitController.store)
    app.put('/habits/:id', [ AuthMiddleware, ], habitController.update)
    app.delete('/habits/:id', [ AuthMiddleware, ], habitController.delete)
}

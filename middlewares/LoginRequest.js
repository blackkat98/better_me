const responseFormatter = require('../utils/response_formatter')

module.exports = async (req, res, next) => {
    let inputs = req.body
    let username = inputs.username || null
    // let email = inputs.email || null
    let password = inputs.password || null
    let lang = req.header('Accept-Language') || 'en'
    req.i18n.changeLanguage(lang)

    if (!username) {
        return res.status(422).json(responseFormatter(false, 422, req.t('Username or Email must be provided')))
    }

    if (!password) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Password'),
        })))
    }

    return next()
}

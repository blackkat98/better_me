const responseFormatter = require('../utils/response_formatter')
const emailRegexCheck = require('../utils/email_regex_check')
const usernameRegexCheck = require('../utils/username_regex_check')

module.exports = async (req, res, next) => {
    let inputs = req.body
    let username = inputs.username || null
    let email = inputs.email || null
    let password = inputs.password || null
    let lang = req.header('Accept-Language') || 'en'
    req.i18n.changeLanguage(lang)

    if (!username && !email) {
        return res.status(422).json(responseFormatter(false, 422, req.t('Username or Email must be provided')))
    }

    if (!password) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Password'),
        })))
    }

    if (username && !usernameRegexCheck(username)) {
        return res.status(422).json(responseFormatter(false, 422, req.t('Username must only contain letters, digits and optionally dots, underscores and at symbols')))
    }

    if (email && !emailRegexCheck(email)) {
        return res.status(422).json(responseFormatter(false, 422, req.t('Invalid email address')))
    }

    if (password && password.length < 8) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must be at least {{length}} characters long', {
            field: req.t('Password'),
            length: 8,
        })))
    }

    return next()
}

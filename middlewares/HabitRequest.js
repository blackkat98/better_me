const responseFormatter = require('../utils/response_formatter')
const habitConstants = require('../constants/habit')

module.exports = async (req, res, next) => {
    let inputs = req.body
    let data = {
        name: inputs.name || '',
        description: inputs.description || '',
        // frequency: inputs.frequency || null,
        timeRepetition: inputs.timeRepetition,
        dateRepetition: inputs.dateRepetition,
        goal: inputs.goal || null,
        layout: inputs.layout || null,
    }

    if (!data.name) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Name'),
        })))
    }

    if (typeof data.name !== 'string') {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
            field: req.t('Name'),
            type: req.t('string'),
        })))
    }

    if (data.name.length > 255) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must be at most {{length}} characters long', {
            field: req.t('Name'),
            length: 255,
        })))
    }

    if (data.description) {
        if (typeof data.description !== 'string') {
            return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
                field: req.t('Description'),
                type: req.t('string'),
            })))
        }

        if (data.description.length > 1023) {
            return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must be at most {{length}} characters long', {
                field: req.t('Description'),
                length: 1023,
            })))
        }
    }

    if (!data.dateType) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Date type'),
        })))
    }

    if (typeof data.dateType !== 'string' || !habitConstants.dateTypes.includes(data.dateType)) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must take one of the following values: {{values}}', {
            field: req.t('Date type'),
            values: habitConstants.dateTypes.join(', ')
        })))
    }

    if (!data.dateRepetition) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Date repetition'),
        })))
    }

    if (!Array.isArray(data.dateRepetition)) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
            field: req.t('Date repetition'),
            type: req.t('array'),
        })))
    }

    if (data.timeRepetition) {
        if (!Array.isArray(data.timeRepetition)) {
            return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
                field: req.t('Time repetition'),
                type: req.t('array'),
            })))
        }
    }

    if (!data.goal) {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} is required', {
            field: req.t('Goal'),
        })))
    }

    if (typeof data.goal.action !== 'string') {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
            field: req.t('Action'),
            type: req.t('string'),
        })))
    }

    if (typeof data.goal.amount !== 'number') {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
            field: req.t('Amount'),
            type: req.t('number'),
        })))
    }

    if (typeof data.goal.unit !== 'string') {
        return res.status(422).json(responseFormatter(false, 422, req.t('{{field}} must have the form of a {{type}}', {
            field: req.t('Unit'),
            type: req.t('string'),
        })))
    }
}

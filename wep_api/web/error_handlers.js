/**
 * @module ErrorHandlingStrategy
 */

const util = require('util')
const HttpStatus = require('http-status-codes')
const user_messages = require('resources').user_messages

const error_handlers = [
    handle_not_implemented,
    handle_bad_request,
    handle_not_found,
    handle_unprocessable_entity,
    handle_server_error
]

module.exports = error_handlers

// NOTE not implemented routes fall here automagically
function handle_not_implemented(req, res) {
    res.statusCode = HttpStatus.NOT_IMPLEMENTED
    const error_response = {
        code: 76543, title: HttpStatus.getStatusText(res.statusCode),
        detail: user_messages.MISHIT
    }
    return res.json(error_response)
}

function handle_bad_request(err, req, res, next) {
    if (is_swagger_error(err)) {
        res.statusCode = HttpStatus.BAD_REQUEST
        const error_response = {
            code: 54321, title: HttpStatus.getStatusText(res.statusCode), detail: err.message
        }
        return res.json(error_response)
    }
    return next(err)
}

function handle_not_found(err, req, res, next) {
    if (err.not_found) {
        res.statusCode = HttpStatus.NOT_FOUND
        const error_response = {
            code: 12345, title: HttpStatus.getStatusText(res.statusCode), detail: err.message
        }
        return res.json(error_response)
    }
    return next(err)
}

function handle_unprocessable_entity(err, req, res, next) {
    if (err.unprocessable_entity) {
        res.statusCode = HttpStatus.UNPROCESSABLE_ENTITY
        const error_response = {
            code: 48379, title: HttpStatus.getStatusText(res.statusCode), detail: err.message
        }
        return res.json(error_response)
    }
    return next(err)
}

// NOTE Remaining -> 500
function handle_server_error(err, req, res, next) {
    // TODO handle JS errors, handle Node errors, handle Mongo errors
    if (err instanceof Error) {
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        const error_response = {
            code: 98765, title: HttpStatus.getStatusText(res.statusCode), detail: util.inspect(err)
            // TODO dev only! prod needed, hide stack, hide message, log message
        }
        return res.json(error_response)
    }
    return next(err)
}

/**
 * Helpers
 * @private
 */
function is_swagger_error(err) {
    return err instanceof Error && err.code && err.failedValidation
}

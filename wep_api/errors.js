const HttpErrors = require('http-errors')

const user_messages = require('./resources').user_messages

module.exports = {
    not_found_error,
    insufficient_funds_error,
    self_transfer_forbidden_error
}

function self_transfer_forbidden_error() {
    _unprocessable_entity_error(user_messages.SELF_TRANSFER_FORBIDDEN)
}

function insufficient_funds_error(account_id) {
    _unprocessable_entity_error(user_messages.INSUFFICIENT_FUNDS + account_id)
}

function not_found_error(account_id) {
    const err_name = 'not_found'
    const err = new HttpErrors.NotFound(user_messages.NOT_FOUND + account_id)
    err[err_name] = err_name
    throw err
}

/**
 * @private
 */
function _unprocessable_entity_error(message) {
    const err_name = 'unprocessable_entity'
    const err = new HttpErrors.UnprocessableEntity(message || err_name)
    err[err_name] = err_name
    throw err
}
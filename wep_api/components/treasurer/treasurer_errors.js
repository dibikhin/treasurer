const HttpErrors = require('http-errors')

const tresurer_user_messages = require('./tresurer_user_messages')
const error_names = require('resources/').error_names

module.exports = {
    account_not_found_error,
    insufficient_funds_error,
    self_transfer_forbidden_error
}

function self_transfer_forbidden_error() {
    _unprocessable_entity_error(tresurer_user_messages.SELF_TRANSFER_FORBIDDEN)
}

function insufficient_funds_error(account_id) {
    _unprocessable_entity_error(tresurer_user_messages.INSUFFICIENT_FUNDS + account_id)
}

function account_not_found_error(account_id) {
    const err_name = error_names.NOT_FOUND
    const err = new HttpErrors.NotFound(tresurer_user_messages.NOT_FOUND + account_id)
    err[err_name] = err_name
    throw err
}

/**
 * @private
 */
function _unprocessable_entity_error(message) {
    const err_name = error_names.UNPROCESSABLE_ENTITY
    const err = new HttpErrors.UnprocessableEntity(message || err_name)
    err[err_name] = err_name
    throw err
}

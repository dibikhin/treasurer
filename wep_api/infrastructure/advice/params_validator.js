const util = require('util')
const Errors = require('resources').Errors

module.exports = is_params_valid

/**
 *
 * @param {object} target
 * @param {function} validate
 * @param {string} member_name
 */
function is_params_valid({ validate, target, member_name }) {
    const valid = validate(target)
    if (!valid) {
        throw new Errors.ValidationError(
            `params is invalid. function: ${member_name},
             params: ${util.inspect(target)},
             errors: ${util.inspect(validate.errors)}`)
        // WARN [DEP0079] DeprecationWarning: Custom inspection function on Objects via.inspect() is deprecated
    }
    return true
}

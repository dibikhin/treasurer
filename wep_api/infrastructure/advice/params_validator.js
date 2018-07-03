const util = require('util');

module.exports = is_params_valid;

/**
 *
 * @param {object} target
 * @param {function} validate
 * @param {string} member_name
 */
function is_params_valid({ validate, target, member_name }) {
    const valid = validate(target);
    if (!valid) {
        throw new Error(
            `params is invalid. function: ${member_name},
             params: ${util.inspect(target)},
             errors: ${util.inspect(validate.errors)}`);
    }
    return true;
}

module.exports = is_params_valid;

/**
 * 
 * @param {object} target 
 * @param {function} validate 
 * @param {string} member_name 
 */
function is_params_valid(target, validate, member_name) {
    const valid = validate(target);
    if (!valid) {
        throw new Error(
            `params is invalid. function: ${member_name}, params: ${JSON.stringify(target)}, errors: ${JSON.stringify(validate.errors)}`);
    }
    return true;
}

module.exports = is_params_valid;

/**
 * 
 * @param {object} params 
 * @param {function} validate 
 * @param {string} member_name 
 */
function is_params_valid(params, validate, member_name) {
    const valid = validate(params);
    if (!valid) {
        throw new Error(
            `params is invalid. function: ${member_name}, params: ${JSON.stringify(params)}, errors: ${JSON.stringify(validate.errors)}`);
    }
    return true;
}

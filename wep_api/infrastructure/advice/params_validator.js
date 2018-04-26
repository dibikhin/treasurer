module.exports = is_params_valid;

/**
 *
 * @param {object} target
 * @param {function} validate
 * @param {string} member_name
 */
function is_params_valid(params) {
    const valid = params.validate(params.target);
    if (!valid) {
        throw new Error(
            `params is invalid. function: ${params.member_name}, params: ${JSON.stringify(params.target)}, errors: ${JSON.stringify(params.validate.errors)}`);
    }
    console.log(2);

    return true;
}

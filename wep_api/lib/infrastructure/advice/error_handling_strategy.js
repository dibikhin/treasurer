module.exports = error_handling_strategy;

/**
 * Log error if any and continue
 * @param {function} target 
 * @param {object} that 
 * @param {object} args 
 */
function error_handling_strategy(target, that, args) {
    const err = args[0];
    if (err) {
        this.error(new Error('asdf') + 'op_id= 1234'); // TODO log op_id. Exit? // WARN 'this' is evil
    }
    return target.apply(null, args);
}

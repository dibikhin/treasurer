module.exports = error_handling_strategy;

/**
 * Log error if any and continue
 * @param {function} target 
 * @param {object} that 
 * @param {object} args 
 */
function error_handling_strategy(target, that, args) {
    const err = args[0];
    const data = args[1];
    if (err) {
        this.error('Data:'); // WARN 'this' is evil
        this.error(data); // WARN 'this' is evil
        this.error(err); // WARN 'this' is evil
    }
    return target.apply(null, args);
}

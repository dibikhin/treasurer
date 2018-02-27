/**
 * Helpers
 * All helpers live here for a while
 * @module helpers
 */

module.exports = {
    bind_to_context: bind_to_context
};

/**
 * Binds each function in the object to another context
 * @param {object} raw_module A Node module
 * @param {object} target_context New context for the module's functions
 * @returns {object} A new module
 */
function bind_to_context(raw_module, target_context) {
    const binded_module = {};
    for (const key in raw_module) {
        binded_module[key] = raw_module[key].bind(target_context);
    }
    return binded_module;
}

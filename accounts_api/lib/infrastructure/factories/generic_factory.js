/**
 * Generic Factory
 * Binds context to a new module created using existing one
 * @module accounts_factory
 */

module.exports = generic_factory;

/**
 * Generic Factory
 * @param {object} ctx Params for injection
 * @returns {object} binded module
 */
function generic_factory(ctx) {
    if (!ctx || !ctx.module || !ctx.helpers || !ctx.target_context) {
        throw new Error('ctx.module and ctx.helpers and ctx.target_context is required');
    }
    return ctx.helpers.bind_to_context(ctx.module, ctx.target_context);
}

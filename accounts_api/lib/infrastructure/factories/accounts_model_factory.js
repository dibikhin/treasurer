/**
 * Accounts Factory
 * Creates Accounts modules binded to DB
 * @module accounts_factory
 */

module.exports = accounts_model_factory;

/**
 * Account factory
 * @param {object} ctx Params for injection
 * @returns {object} binded module
 */
function accounts_model_factory(ctx) {
    if (!ctx || !ctx.db || !ctx.module) {
        throw new Error('ctx.db and ctx.module is required');
    }
    const target_context = { db: ctx.db };
    return ctx.helpers.bind_to_context(ctx.module, target_context);
}

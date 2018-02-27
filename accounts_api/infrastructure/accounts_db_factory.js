/**
 * Accounts DB factory
 * @module accounts_db_factory
*/

module.exports = accounts_db_factory;

/**
 * Accounts DB factory
 * @param {object} ctx Params for injection
 */
function accounts_db_factory(ctx) {
    if (!ctx || !ctx.driver || !ctx.module) {
        throw new Error('ctx.driver and ctx.module is required');
    }
    const target_context = { db: ctx.db, driver: ctx.driver };
    return ctx.helpers.bind_to_context(ctx.module, target_context);
}

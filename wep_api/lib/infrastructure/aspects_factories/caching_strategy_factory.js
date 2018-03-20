module.exports = create;

function create(ctx, params) { // WARN closures
    return function caching_strategy_aspect(invocation) {
        const noop = () => { };
        const caching_strategy = params.caching_strategy();
        const handler_params = {
            invocation
        };

        const handler = caching_strategy[invocation.memberName];
        (handler ? handler : noop)(ctx, handler_params);

        invocation.proceed();
    };
}

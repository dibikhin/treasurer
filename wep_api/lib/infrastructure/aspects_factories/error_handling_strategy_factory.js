module.exports = create;

function create(ctx, params) {
    return function error_handling_strategy_aspect(invocation) {
        const bound_error_handling_strategy = params.error_handling_strategy.bind(ctx.logger); // WARN state
        ctx.helpers.replace_callback({
            args: invocation.parameters,
            callback_interceptor: bound_error_handling_strategy
        });
        invocation.proceed();
    };
}

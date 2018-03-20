module.exports = create;

function create(ctx, params) {
    return function callback_validator_aspect(invocation) {
        const callback = ctx.helpers.get_callback(invocation.parameters); // WARN closure
        params.callback_validator_advice(callback);
        invocation.proceed();
    };
}

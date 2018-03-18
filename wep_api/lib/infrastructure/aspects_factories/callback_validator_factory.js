module.exports = create;

function create(ctx, callback_validator_advice) {
    return function callback_validator_aspect(invocation) {
        const callback = ctx.helpers.get_callback(invocation.parameters); // WARN closure
        callback_validator_advice(callback);
        invocation.proceed();
    };
}

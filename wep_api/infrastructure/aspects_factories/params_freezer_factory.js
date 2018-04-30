module.exports = create;

function create(params) {
    return function params_freezer_aspect(invocation) {
        const invocation_params = invocation.parameters[1];
        params.params_freezer_advice(invocation_params);
        console.log(1);

        return invocation.proceed();
    };
}

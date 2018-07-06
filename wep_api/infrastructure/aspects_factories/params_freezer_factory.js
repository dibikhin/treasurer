module.exports = create

function create({ params_freezer_advice }) {
    return function params_freezer_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const invocation_params = invocation.parameters[0]
            params_freezer_advice(invocation_params)
        }
        return invocation.proceed()
    }
}

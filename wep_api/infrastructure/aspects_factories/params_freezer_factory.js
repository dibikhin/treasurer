module.exports = create

function create({ params_freezer_advice }) {
    return function params_freezer_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const args = invocation.parameters[0]
            params_freezer_advice(args)
        }
        return invocation.proceed()
    }
}

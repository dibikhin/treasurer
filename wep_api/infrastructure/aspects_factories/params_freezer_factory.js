module.exports = create

function create({ params_freezer_advice }) {
    return function params_freezer_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const the_params = invocation.parameters[0] // NOTE 'params'-first expected
            params_freezer_advice(the_params)
        }
        return invocation.proceed()
    }
}

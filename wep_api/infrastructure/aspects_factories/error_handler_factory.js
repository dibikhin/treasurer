module.exports = create

function create() {
    return function error_handler_aspect(invocation) {

        // TODO move error handling here?

        return invocation.proceed()
    }
}

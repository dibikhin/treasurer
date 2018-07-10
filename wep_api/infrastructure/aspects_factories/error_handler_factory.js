module.exports = create

function create() {
    return function error_handler_aspect(invocation) {

        // TODO put error handling here?

        return invocation.proceed()
    }
}

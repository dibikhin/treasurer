const util = require('util')

module.exports = create

function create({ logger }) {
    return async function error_handler_aspect(invocation) {
        try {
            return await invocation.proceed()
        } catch (err) {
            logger.error('sdfgsdfgsdfg')
            logger.error(util.inspect(err))
        }
    }
}

module.exports = error_handling_strategy

function error_handling_strategy(fn, logger) {
    return function catch_to_next_wrapper(...args) {
        const next = args[args.length - 1] // NOTE unhandled intentionally
        const error_handling_proxy = err => {

            // just log, continue in next()
            logger.error(args)
            logger.error(err) // TODO log op_id
            return next(err)
        }
        return fn(...args).catch(error_handling_proxy)
    }
}

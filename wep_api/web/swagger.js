const http = require('http')

const swagger_tools = require('swagger-tools')

module.exports = {
    start
}

// TODO split: swagger|done|op_id, SRP violation
function start(ctx, params, opts, done) {
    swagger_tools.initializeMiddleware(
        ctx.swagger_doc, function initializeMiddleware_callback(middleware) {
            ctx.connect.use(middleware.swaggerMetadata()) // NOTE should be first
            ctx.connect.use(middleware.swaggerValidator(opts.validator))
            ctx.connect.use(function generalize_params(req, res, next) {
                req.params = extract_swagger_params(req)
                return next()
            })
            ctx.connect.use(middleware.swaggerUi())

            ctx.connect.use(function copy_op_id(req, res, next) {
                req.params && (req.params.op_id = req.op_id)
                return next()
            })

            // NOTE [last-1]
            ctx.connect.use(middleware.swaggerRouter(opts))

            // NOTE [last]
            params.add_error_handlers({ app: ctx.connect, error_handlers: params.error_handlers })

            return done({ http, app: ctx.connect, port: opts.port })
        })
}

function extract_swagger_params(req) {
    return req && (
        req.swagger && ((req.swagger.params.body && req.swagger.params.body.value) || req.swagger.params))
}

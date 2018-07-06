module.exports = {
    run
}

function run(ctx, opts, done) {
    ctx.swagger_tools.initializeMiddleware(
        ctx.swagger_doc, function initializeMiddleware_callback(middleware) {
            ctx.connect.use(middleware.swaggerMetadata()) // should be first
            ctx.connect.use(middleware.swaggerValidator(opts.validator))

            ctx.connect.use(function generalize_params(req, res, next) {
                // TODO holy shit
                req.params = (req.swagger && ((req.swagger.params.body && req.swagger.params.body.value) || req.swagger.params))
                next()
            })
            ctx.connect.use(middleware.swaggerUi())
            ctx.connect.use(middleware.swaggerRouter(opts)) // should be last

            done({ http: ctx.http, app: ctx.connect, port: opts.port })
        })
}

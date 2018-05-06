module.exports = {
    run
};

async function run(ctx, opts, done) {
    ctx.swagger_tools.initializeMiddleware(
        ctx.swagger_doc, function initializeMiddleware_callback(middleware) {
            ctx.connect.use(middleware.swaggerMetadata()); // should be first
            ctx.connect.use(middleware.swaggerValidator(opts.validator));
            ctx.connect.use(middleware.swaggerRouter(opts));
            ctx.connect.use(middleware.swaggerUi());

            done({ http: ctx.http, app: ctx.connect, port: opts.port });
        });
}

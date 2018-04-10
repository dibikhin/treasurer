module.exports = {
    run
};

function run(ctx, opts) {
    ctx.swagger_tools.initializeMiddleware(
        ctx.swagger_doc, function initializeMiddleware_callback(middleware) {
            ctx.app.use(middleware.swaggerMetadata()); // should be first
            ctx.app.use(middleware.swaggerValidator());
            ctx.app.use(middleware.swaggerRouter(opts));
            ctx.app.use(middleware.swaggerUi());

            ctx.run_server(ctx.app);
        });
}

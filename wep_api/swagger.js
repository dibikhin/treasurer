module.exports = {
    init
};

function init(ctx, opts, done) {
    ctx.swagger_tools.initializeMiddleware(
        ctx.swagger_doc, function initializeMiddleware_callback(middleware) {
            ctx.connect.use(middleware.swaggerMetadata()); // should be first
            ctx.connect.use(middleware.swaggerValidator({ validateResponse: true }));
            ctx.connect.use(middleware.swaggerRouter(opts));
            ctx.connect.use(middleware.swaggerUi());

            done(ctx.connect);
        });
}

module.exports = {
    config
};

async function config({ app, app_ctx, serve_static, no_cache, cors, json, uuidv1 }) {
    app.use(no_cache()); // should be first
    app.use(serve_static('public'));
    app.use(cors());
    app.use(json());
    app.use(function set_ctx(req, res, next) {
        req.ctx = app_ctx;
        next();
    });

    // TODO add op_id strategy
    app.use(function set_op_id(req, res, next) {
        req.op_id = uuidv1();
        next();
    });
    app.use(function set_headers(req, res, next) {
        res.setHeader('X-Request-ID', req.op_id);
        next();
    });
}

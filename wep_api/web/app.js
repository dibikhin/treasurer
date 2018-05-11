module.exports = {
    config
};

async function config({ app, app_ctx, favicon, serve_static, no_cache, cors, json, generate_op_id }) {
    app.use(no_cache()); // should be first
    app.use(favicon('public/favicon.ico'));
    app.use(serve_static('public'));
    app.use(cors());
    app.use(json());
    app.use(function set_ctx(req, res, next) {
        req.ctx = app_ctx;
        next();
    });
    app.use(function set_op_id(req, res, next) {
        req.op_id = _get_op_id({ req, generate_op_id });
        next();
    });
    app.use(function set_headers(req, res, next) {
        res.setHeader('X-Request-ID', req.op_id);
        next();
    });
}

/**
 * @private
 */
function _get_op_id({ req, generate_op_id }) {
    return req.headers['x-now-id'] || req.headers['x-request-id'] || generate_op_id();
}

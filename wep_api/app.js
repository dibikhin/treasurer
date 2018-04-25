module.exports = {
    init
};

function init({ app, app_ctx, no_cache, json, uuidv1 }) {
    app.use(no_cache());
    app.use(json());
    app.use(function (req, res, next) {
        req.ctx = app_ctx;
        next();
    });
    app.use(function (req, res, next) {
        req.op_id = uuidv1();
        next();
    });
    app.use(function (req, res, next) {
        res.setHeader('X-Request-ID', req.op_id);
        next();
    });
}

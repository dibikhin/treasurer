module.exports = {
    configure
}

function configure({ morgan, logger, app, favicon, serve_static, no_cache, cors, json, generate_op_id }) { // eslint-disable-line no-unused-vars
    app.use(no_cache()) // should be first
    // app.use(morgan('combined', { stream: logger.stream })) TODO
    app.use(favicon('public/favicon.ico'))
    app.use(serve_static('public'))
    app.use(cors())
    app.use(json())

    app.use(function set_op_id(req, res, next) {
        req.op_id = _get_op_id({ req, generate_op_id })
        return next()
    })
    app.use(function set_headers(req, res, next) {
        res.setHeader('X-Request-ID', req.op_id)
        return next()
    })
}

/**
 * @private
 */
function _get_op_id({ req, generate_op_id }) {
    return req.headers['x-now-id'] || req.headers['x-request-id'] || generate_op_id()
}

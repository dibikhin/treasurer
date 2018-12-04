const json = require('res-json')
const cors = require('cors')
const serve_static = require('serve-static')
const no_cache = require('nocache')
const favicon = require('serve-favicon')

module.exports = {
    configure
}

function configure({ connect, generate_op_id }) {
    connect.use(no_cache()) // should be first
    // app.use(morgan('combined', { stream: logger.stream })) TODO
    connect.use(favicon('public/favicon.ico'))
    connect.use(serve_static('public'))
    connect.use(cors())
    connect.use(json())

    connect.use(function set_op_id(req, res, next) {
        req.op_id = _get_op_id({ req, generate_op_id })
        return next()
    })
    connect.use(function set_headers(req, res, next) {
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

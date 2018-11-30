const fs = require('fs')
const js_yaml = require('js-yaml')

module.exports = _init()

function _init() {
    const web = { to_swagger_opts }
    web.port = process.env.PORT || 8080
    web.controller_prefix = 'treasurer_controller_' // starts like in swagger.yaml

    web.swagger = {
        ui_path: 'web/treasurer_api.yaml',
        controllers_path: 'components/treasurer/controllers', // WARN why nowhere works?
        use_stubs: false,
        compose_host,
        configure_doc,
        validator: { validateResponse: true }
    }
    return web
}

function compose_host(default_host) {
    return process.env.NOW_URL ? process.env.NOW_URL.replace('https://', '') : default_host
}

function configure_doc({ port, swagger_configs }) {
    const spec = fs.readFileSync(swagger_configs.ui_path, 'utf8')
    const swagger_doc = js_yaml.safeLoad(spec)
    swagger_doc.host = swagger_configs.compose_host('localhost:' + port)
    return swagger_doc
}

function to_swagger_opts({ port, swagger }, controllers) {
    return {
        port: port,
        swaggerUi: swagger.ui_path,
        controllers,
        useStubs: swagger.use_stubs,
        validator: swagger.validator
    }
}

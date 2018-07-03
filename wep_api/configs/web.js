module.exports = _init();

function _init() {
    const web = {};
    web.port = process.env.PORT || 8080;
    web.treasurer_controller_prefix = 'treasurer_controller_';

    web.swagger = {
        ui_path: 'web/treasurer_api.yaml',
        controllers_path: 'components/treasurer/controllers',
        use_stubs: false,
        compose_host: compose_host,
        validator: { validateResponse: true }
    };

    web.to_swagger_opts = to_swagger_opts;
    web.swagger.configure_doc = configure_doc;
    return web;
}

function compose_host(default_host) {
    return process.env.NOW_URL ? process.env.NOW_URL.replace('https://', '') : default_host;
}

function configure_doc({ fs, js_yaml, port, swagger }) {
    const spec = fs.readFileSync(swagger.ui_path, 'utf8');
    const swagger_doc = js_yaml.safeLoad(spec);
    swagger_doc.host = swagger.compose_host('localhost:' + port); // swagger_doc.host
    return swagger_doc;
}

function to_swagger_opts({ port, swagger }, controllers) {
    return {
        port: port,
        swaggerUi: swagger.ui_path,
        controllers,
        useStubs: swagger.use_stubs,
        validator: swagger.validator
    };
}

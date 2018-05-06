const web = {};
web.port = process.env.PORT || 8080;

web.swagger = {
    ui_path: 'web/swagger.yaml',
    controllers_path: 'components/treasurer/controllers',
    use_stubs: false,
    host: _compose_host,
    validator: { validateResponse: true }
};

web.to_swagger_opts = _to_swagger_opts;
web.swagger.configure_doc = _configure_doc;

function _compose_host(default_host) {
    // TODO localhost vs demohost
    return process.env.NODE_ENV === 'development' ? 'treasurer-demo-1.now.sh' : default_host;
}

function _configure_doc({ fs, js_yaml }) {
    const spec = fs.readFileSync(web.swagger.ui_path, 'utf8');
    const swagger_doc = js_yaml.safeLoad(spec);
    // TODO fix closure magic
    swagger_doc.host = web.swagger.host(swagger_doc.host);
    return swagger_doc;
}

function _to_swagger_opts(params) {
    return {
        port: params.port,
        swaggerUi: params.swagger.ui_path,
        controllers: params.swagger.controllers_path,
        useStubs: params.swagger.use_stubs,
        validator: params.swagger.validator
    };
}

module.exports = web;

/**
 * Entry point
 * @module bootstrapper
 */

console.info('Starting...');

const uuidv1 = require('uuid/v1');
const benalu = require('lib/benalu/benalu'); // self built, due to an old npm
const ajv = require('ajv');

const mongodb = require('mongodb');

const http = require('http');

const serve_static = require('serve-static');
const no_cache = require('nocache');
const favicon = require('serve-favicon');
const cors = require('cors');
const _connect = require('connect');
const connect = _connect();

const json = require('res-json');
const js_yaml = require('js-yaml');
const fs = require('fs');

const swagger_tools = require('swagger-tools');

const infra = require('infrastructure');

const configs = require('configs');

const web = require('web');
const treasurer = require('components/treasurer');
const db = require('components/db');

const bootstrapper = { run };
bootstrapper.run();

async function run() {
    const contexts = {};
    contexts.treasurer = {};
    contexts.treasurer.dal = { driver: mongodb };

    await db.connect(contexts.treasurer.dal, configs.mongo);

    configs.treasurer = {};
    configs.treasurer.params_validators = configs.ajv.configure({
        ajv, infra, mongo_is_valid: mongodb.ObjectID.isValid, schemas: treasurer.params_schemas
    });

    configure_web_app({ web, contexts });
    configure_swagger({ configs, contexts });

    // WARN spaghetti references?
    const treasurer_model_proxy = create_treasurer_model_proxy({ infra, configs, contexts, treasurer });
    contexts.treasurer.model.Model = treasurer_model_proxy;

    const swagger_opts = create_swagger_opts({ infra, configs, contexts, treasurer });
    return web.swagger.run(contexts.swagger, swagger_opts, web.server.run);
}

/**
 * privates
 */

function configure_web_app({ web, contexts }) {
    contexts.middleware = {
        app: connect, favicon, serve_static, no_cache, cors, json, generate_op_id: uuidv1
    };
    return web.app.configure(contexts.middleware);
}

function configure_swagger({ contexts, configs }) {
    const swagger_doc = configs.web.swagger.configure_doc({
        fs, js_yaml, port: configs.web.port, swagger: configs.web.swagger
    });
    contexts.swagger = {
        http, connect, swagger_tools, swagger_doc
    };
}

function create_treasurer_model_proxy({ infra, configs, contexts, treasurer }) {
    // bake dal
    const treasurer_dal = infra.helpers.bake_context(treasurer.dal, contexts.treasurer.dal);
    contexts.treasurer.model = {
        Dal: treasurer_dal,
        is_payable: treasurer.threshold_strategy
    };
    // bake model
    // WARN bake -> aopize -> use
    const treasurer_model_baked = infra.helpers.bake_context(treasurer.model, contexts.treasurer.model);

    contexts.treasurer_aop = {
        infra,
        aop_provider: benalu,
        target: treasurer_model_baked,
        params_validators: configs.treasurer.params_validators
    };
    const treasurer_model_proxy = infra.aop.factory.create(contexts.treasurer_aop);
    contexts.app = {
        Treasurer: treasurer_model_proxy
    };
    return treasurer_model_proxy;
}

function create_swagger_opts({ infra, configs, contexts, treasurer }) {
    const controller = infra.web.helpers.prepare_controller(configs.web.treasurer_controller_prefix, treasurer.controller);
    const controller_baked = infra.helpers.bake_context(controller, contexts.app);
    const swagger_opts = configs.web.to_swagger_opts(configs.web, controller_baked);
    return swagger_opts;
}


// zid 1 5ae727e310184a24eabab171
// zid 2 5b408daf597b9c38ee35fe2e


// TODO ask for benalu npm update or post a private npm
// TODO play with "javascript.implicitProjectConfig.checkJs": true

// TODO eslint: remove and ban console.console.log();
// TODO ban string literals, move to config
// TODO convert to es6 modules

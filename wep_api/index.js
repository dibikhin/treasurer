/**
 * Entry point
 * @module bootstrapper
 */

console.info('Starting...');

const uuidv1 = require('uuid/v1');
const benalu = require('node_modules/benalu/benalu'); // self built, due to old npm
const Ajv = require('ajv');

const mongodb = require('mongodb');

const http = require('http');
const no_cache = require('nocache');
const _connect = require('connect');
const connect = _connect();
const json = require('res-json');
const js_yaml = require('js-yaml');
const fs = require('fs');

const swagger_tools = require('swagger-tools');

const infra = require('./infrastructure');

const web = require('./web');
const treasurer = require('./components/treasurer');
const db = require('./components/db');

const bootstrapper = { run };
bootstrapper.run();

/**
 * Config & start the app
 */
async function run() {
    const ajv = new Ajv({ allErrors: true });
    infra.ajv.add_custom_keywords({ mongodb, ajv, ajv_helpers: infra.ajv.helpers });
    const treasurer_params_validators = infra.ajv.helpers.compile_validators({
        ajv,
        schemas: treasurer.params_schemas
    });

    const treasurer_model_proxy = treasurer.aop_bootstrap.init({
        infra,
        aop_provider: benalu,
        target: treasurer.model,
        params_validators: treasurer_params_validators
    });

    const contexts = {};

    contexts.treasurer = {
        driver: mongodb,
        db_adapter: treasurer.dal,
        is_payable: treasurer.threshold_strategy
    };

    const mongo_opts = {
        mongo_url: 'mongodb://localhost:27017',
        db_name: 'test',
        collection_name: 'accounts'
    };
    await db.connect(contexts.treasurer, mongo_opts);

    const port = 8080;

    contexts.app = {
        treasurer: treasurer_model_proxy,
        treasurer_ctx: contexts.treasurer
    };
    contexts.middleware = {
        app: connect, app_ctx: contexts.app, no_cache, json, uuidv1
    };
    await web.app.config(contexts.middleware);

    const spec = fs.readFileSync('web/swagger.yaml', 'utf8');
    const swagger_doc = js_yaml.safeLoad(spec);
    swagger_doc.host = process.env.NODE_ENV === 'development' ? `localhost:${port}` : swagger_doc.host;
    contexts.swagger = {
        http, connect, swagger_tools, swagger_doc
    };
    const swagger_opts = {
        port,
        swaggerUi: 'api/swagger.yaml',
        controllers: 'components/treasurer', // TODO fix workaround
        useStubs: false //process.env.NODE_ENV === 'development'
    };
    await web.swagger.run(contexts.swagger, swagger_opts, web.server.run);
}


// 5ae6d0b30e15c70cd3240f1b


// TODO aspect: freeze returned objects
// TODO freeze opts & ctxs
// TODO freeze -> clone + freeze
// TODO remove and ban console.log
// play with "javascript.implicitProjectConfig.checkJs": true

// const Cache = require('ttl');

// const caching_strategy_factory = require('infrastructure/aspects_factories/caching_strategy_factory');
// const error_handling_strategy_factory = require('infrastructure/aspects_factories/error_handling_strategy_factory');

// const error_handling_strategy = require('infrastructure/advice/error_handling_strategy');

// const helpers = require('infrastructure/helpers');

// const cache_adapter = require('db/cache_adapter');

// const cache = new Cache({ ttl: 30 * 1000 });

// order matters, but how? caching_strategy_factory may break next interceptors
// const accounts_db_adapter = benalu
//     .fromInstance(accounts_db_adapter_raw)
// // config cache 'enabled' option
// .addInterception(
//     caching_strategy_factory({ helpers, cache, cache_adapter }))
// .addInterception(
//     error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))
//     .build();

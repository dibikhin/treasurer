/**
 * Entry point
 * @module bootstrap
 */

console.info('Starting...');

const uuidv1 = require('uuid/v1');
const benalu = require('./node_modules/benalu/benalu'); // self built, due to old npm
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const mongodb = require('mongodb');

const no_cache = require('nocache');
const connect = require('connect')();
const json = require('res-json');
const swagger_tools = require('swagger-tools');
const js_yaml = require('js-yaml');
const fs = require('fs');

const app = require('./app'); // WARN dots
const swagger = require('./swagger');
const server = require('./bin/www');

const params_validator_factory = require('infrastructure/aspects_factories/params_validator_factory');
const params_freezer_factory = require('infrastructure/aspects_factories/params_freezer_factory');
const is_params_valid = require('infrastructure/advice/params_validator');

const ajv_helpers = require('infrastructure/ajv/helpers');
const ajv_add_custom_keywords = require('infrastructure/ajv/custom_keywords');

const treasurer_params_schemas = require('schemas/treasurer_params.json');
ajv_add_custom_keywords({ ajv_helpers, ajv, mongodb });
const treasurer_params_validators = ajv_helpers.compile_validators({ ajv, schemas: treasurer_params_schemas });

const threshold_strategy = require('business_rules/threshold_strategy');

const accounts_db_adapter = require('db/accounts_db_adapter');
const accounts_db_bootstrap = require('db/accounts_db_bootstrap');

const treasurer_raw = require('models/treasurer');

const treasurer = benalu
    .fromInstance(treasurer_raw)
    .addInterception(
        params_freezer_factory({
            params_freezer_advice: Object.freeze
        })
    )
    .addInterception(
        params_validator_factory({
            params_validators: treasurer_params_validators,
            params_validator_advice: is_params_valid
        }))

    // .addInterception(
    //error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))

    .build();

const treasurer_ctx = {
    driver: mongodb,
    db_adapter: accounts_db_adapter,
    is_payable: threshold_strategy
};

const mongo_opts = Object.freeze({
    mongo_url: 'mongodb://localhost:27017',
    db_name: 'test',
    collection_name: 'accounts'
});

// TODO convert to sync?
(async function init_db(ctx_warm, conn_opts) {
    await accounts_db_bootstrap.init(ctx_warm, conn_opts);

    Object.freeze(ctx_warm);
})(treasurer_ctx, mongo_opts);

const port = 8080; // TODO config

const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swagger_doc = js_yaml.safeLoad(spec);
swagger_doc.host = process.env.NODE_ENV === 'development' ? `localhost:${port}` : swagger_doc.host;

const app_ctx = Object.freeze({
    log: console.log,
    Treasurer: treasurer,
    treasurer_ctx: treasurer_ctx
});

const middleware_ctx = {
    app: connect, app_ctx, no_cache, json, uuidv1
};
app.init(middleware_ctx);

const swagger_ctx = {
    connect, swagger_tools, swagger_doc
};
const swagger_opts = {
    port,
    swaggerUi: '/swagger.yaml',
    controllers: './controllers', // what a dirty dot?
    useStubs: process.env.NODE_ENV === 'development'
};

swagger.init(swagger_ctx, swagger_opts, server.run);

// 5a99b022b0a023125aaaae28

// TODO aspect: freeze returned objects
// TODO remove and ban console.log
// TODO warn on constant
// TODO get op_id from X-Request-ID request header
// TODO const contexts_manager = {}; // Hierarchic contexts?
// contexts_manager.treasurer_ctx =
// TODO freeze opts & ctxs


// // const Cache = require('ttl');

// // const caching_strategy_factory = require('infrastructure/aspects_factories/caching_strategy_factory');
// // const error_handling_strategy_factory = require('infrastructure/aspects_factories/error_handling_strategy_factory');

// // const error_handling_strategy = require('infrastructure/advice/error_handling_strategy');

// // const helpers = require('infrastructure/helpers');

// // const cache_adapter = require('db/cache_adapter');

// // const cache = new Cache({ ttl: 30 * 1000 });

// // // order matters, but how? caching_strategy_factory may break next interceptors
// const accounts_db_adapter = benalu
//     .fromInstance(accounts_db_adapter_raw)
//     //     // // config cache 'enabled' option
//     //     // .addInterception(
//     //     //     caching_strategy_factory({ helpers, cache, cache_adapter }))
//     //     // .addInterception(
//     //     //     error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))
//     .build();

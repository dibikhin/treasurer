/**
 * Entry point
 * @module bootstrap
 */

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const benalu = require('benalu/benalu'); // self built, due to old npm
const mongodb = require('mongodb');
const Cache = require('ttl');

const accounts_params_schemas = require('schemas/accounts_params.json');

const threshold_strategy = require('business_rules/threshold_strategy');

const caching_rules_factory = require('infrastructure/advice/caching_rules_factory');
const callback_validator_factory = require('infrastructure/advice/callback_validator_factory');

const is_callback_valid = require('infrastructure/aspects/callback_validator');

const helpers = require('infrastructure/helpers');

const accounts_raw = require('models/accounts');
const accounts_db_adapter_raw = require('db/accounts_db_adapter');
const accounts_db_bootstrap = require('db/accounts_db_bootstrap');

console.info('Starting...');

// TODO find lazy (on call expiry) cache w/ function caching & callback substitution
const cache = new Cache({ ttl: 30 * 1000 }); // TODO config

const accounts_db_adapter = benalu
    .fromInstance(accounts_db_adapter_raw)
    .addInterception(callback_validator_factory({ helpers }, is_callback_valid)) // TODO config cache option
    .addInterception(caching_rules_factory({ helpers, cache })) // order matters, but how?
    .build();

ajv.addKeyword('mongo_object_id', {
    compile: schema => {
        return data => mongodb.ObjectID.isValid(data);
    }
});

const accounts_params_validators = {};
for (let schema_name in accounts_params_schemas) {
    accounts_params_validators[schema_name] = ajv.compile(accounts_params_schemas[schema_name]);
}

const accounts = benalu
    .fromInstance(accounts_raw)
    .addInterception(callback_validator_factory({ helpers }, is_callback_valid))
    .addInterception((invocation) => {
        const validate = accounts_params_validators[invocation.memberName];
        const params = invocation.parameters[1];
        const valid = validate(params);
        if (!valid) {
            console.log();

            console.log(invocation.memberName);
            console.log(params);
            console.log(valid);
            console.log(validate.errors);
        }
        invocation.proceed();
    })
    .build();

const schema = {
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "account_id": {
            "mongo_object_id": true
        }
    },
    "required": [
        "account_id"
    ]
};

// const validate = ajv.compile(schema);
// console.log(validate({
//     account_id: '5a99b022b0a023125aaaae28',
//     outgoing: null,
//     amount: '-0.125',
//     incoming: '1.0'
// }));
// console.log(ajv.errorsText(validate.errors));

// for (let schema_name in accounts_params_schemas) {
//     let validate = ajv.compile(accounts_params_schemas[schema_name]);
//     console.log('');
//     console.log(schema_name);
//     console.log(validate({ account_id: '5a99b022b0a023125aaaae28' }));
//     console.log(validate({ account_id: '5a99b022b0a023125aaaae28', incoming: '1234.431' }));
//     console.log(validate({ account_id: '5a99b022b0a023125aaaae28', outgoing: '1234.431' }));
//     console.log(validate({ from: '5a99b022b0a023125aaaae28', to: '5a99b022b0a023125aaaae28', tranche: '1234.456' }));
// }

// addInterception validate business rules ?

// TODO const contexts_manager = {};
// contexts_manager.accounts_ctx =
const accounts_ctx = {
    driver: mongodb,
    db_adapter: accounts_db_adapter,
    is_payable: threshold_strategy
};

// TODO config.js > mongo_config.js
const conn_opts = {
    mongo_url: 'mongodb://localhost:27017',
    db_name: 'test',
    collection_name: 'accounts'
};

accounts_db_bootstrap
    .init(accounts_ctx, conn_opts)
    .then(run_test)
    .catch(err => {
        console.error('error', err);
        process.exit(0);
    });

function run_test(accounts_col) {
    accounts_ctx.db = { accounts: accounts_col };

    let params = {
        account_id: '5a99b022b0a023125aaaae28' // mongodb.ObjectID.isValid('zxcv');
    };

    accounts.balance(accounts_ctx, params, (err, data) => {
        if (err) { console.error(err); process.exit(0); }
        console.info('b1=' + data.value.balance.toString());

        params.outgoing = '0.125';
        accounts.withdraw(accounts_ctx, params, (err, data) => {
            if (err) { console.error(err); process.exit(0); }
            console.info(data.value.balance.toString());

            setTimeout(() => {
                accounts.balance(accounts_ctx, params, (err, data) => {
                    if (err) { console.error(err); process.exit(0); }
                    console.info('b2=' + data.value.balance.toString());

                    params.outgoing = null;
                    params.incoming = '1.0';
                    accounts.deposit(accounts_ctx, params, (err, data) => {
                        if (err) { console.error(err); process.exit(0); }
                        console.info(data.value.balance.toString());

                        accounts.balance(accounts_ctx, params, (err, data) => {
                            if (err) { console.error(err); process.exit(0); }
                            console.info('b3=' + data.value.balance.toString());

                            params = {
                                from: '5a99b022b0a023125aaaae28',
                                to: '5a9a954f24ca261c2e2fc032',
                                tranche: '0.5'
                            };
                            accounts.transfer(accounts_ctx, params, (err, data) => {
                                console.info(data.from.value.balance.toString());
                                console.info(data.to.value.balance.toString());

                                console.info('Finished.');
                                process.exit(0);
                            });
                        });
                    });
                });
            }, 1000);
        });
    });
}

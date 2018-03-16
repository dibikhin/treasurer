/**
 * Entry point
 * @module bootstrap
 */

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const benalu = require('benalu/benalu'); // self built, due to old npm
const mongodb = require('mongodb');
const Cache = require('ttl');

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

const accounts = benalu
    .fromInstance(accounts_raw)
    .addInterception(callback_validator_factory({ helpers }, is_callback_valid))
    .build();

ajv.addKeyword('mongo_id', {
    compile: function (schema) {
        return data => mongodb.ObjectID.isValid(data);
    }
});

const balance_schema = {
    'type': 'object',
    'properties': {
        'account_id': { 'mongo_id': true },
    },
    'maxProperties': 1,
    'required': ['account_id']
};

const deposit_schema = {
    'type': 'object',
    'properties': {
        'account_id': { 'mongo_id': true },
        'incoming': { 'type': 'string' } // decimal 0..zillion
    },
    'maxProperties': 2,
    'required': ['account_id', 'incoming']
};

const withdraw_schema = {
    'type': 'object',
    'properties': {
        'account_id': { 'mongo_id': true },
        'outgoing': { 'type': 'string' } // decimal 0..zillion
    },
    'maxProperties': 2,
    'required': ['account_id', 'outgoing']
};

const transfer_schema = {
    'type': 'object',
    'properties': {
        'from': { 'mongo_id': true },
        'to': { 'mongo_id': true },
        'tranche': { 'type': 'string' } // decimal 0..zillion
    },
    'maxProperties': 3,
    'required': ['from', 'to', 'tranche']
};

let validate = ajv.compile(balance_schema);
console.log(validate({}));
console.log('Invalid: ' + ajv.errorsText(validate.errors));
console.log(validate({ account_id: '5a99b022b0a023125aaaae28' }));

validate = ajv.compile(deposit_schema);
console.log(validate({}));
console.log('Invalid: ' + ajv.errorsText(validate.errors));
console.log(validate({ account_id: '5a99b022b0a023125aaaae28', incoming: '1234.431' }));

validate = ajv.compile(withdraw_schema);
console.log(validate({ account_id: true }));
console.log('Invalid: ' + ajv.errorsText(validate.errors));
console.log(validate({ account_id: '5a99b022b0a023125aaaae28', outgoing: '1234.431' }));

validate = ajv.compile(transfer_schema);
console.log(validate({ from: 'qwer' }));
console.log('Invalid: ' + ajv.errorsText(validate.errors));
console.log(validate({ from: '5a99b022b0a023125aaaae28', to: '5a99b022b0a023125aaaae28', tranche: '1234.456' }));

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

// accounts_db_bootstrap
//     .init(accounts_ctx, conn_opts)
//     .then(run_test)
//     .catch(err => {
//         console.error('error', err);
//         process.exit(0);
//     });

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

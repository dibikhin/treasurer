const benalu = require('benalu');
const mongodb = require('mongodb');

const create_callback_advice = require('infrastructure/advice/callback_advice');
const is_callback_valid = require('infrastructure/aspects/callback_validator');

const helpers = require('infrastructure/helpers');

const generic_factory = require('infrastructure/factories/generic_factory');

const accounts_model_module = require('models/accounts');
const accounts_db_adapter_module = require('db/accounts_db_adapter');

const accounts_db_adapter = generic_factory({
    helpers: helpers,
    module: accounts_db_adapter_module,
    target_context: {
        driver: mongodb
    }
});

console.info('Starting...');

// wrap accounts_db into benalu, split accounts_db (init), aspect validate account_id

accounts_db_adapter
    .init({
        mongo_url: 'mongodb://localhost:27017',
        db_name: 'test',
        collection_name: 'accounts'
    })
    .then(run)
    //.then(() => { console.log('asdf'); })
    .catch(err => {
        console.error('error', err);
        process.exit(0);
    });

function run() {
    const accounts_unwrapped = generic_factory({
        helpers: helpers,
        module: accounts_model_module,
        target_context: {
            db: accounts_db_adapter
        }
    });

    let params = {
        account_id: '5a99b022b0a023125aaaae28' // mongodb.ObjectID.isValid('zxcv');
    };

    const accounts = benalu
        .fromInstance(accounts_unwrapped)
        .addInterception(create_callback_advice(is_callback_valid))
        .build();

    // addInterception validate business rules

    accounts.balance(params, (err, data) => {
        if (err) {
            console.error(err); // TODO add error handling
        }
        console.info(data.value.balance.toString());

        params.outgoing = '0.125';
        accounts.withdraw(params, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.info(data.value.balance.toString());

            params.outgoing = null;
            params.incoming = '1.0';
            accounts.deposit(params, (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.info(data.value.balance.toString());

                params = {
                    from: '5a99b022b0a023125aaaae28',
                    to: '5a9a954f24ca261c2e2fc032',
                    tranche: '0.5'
                };
                accounts.transfer(params, (err, data) => {
                    console.info(data.from.value.balance.toString());
                    console.info(data.to.value.balance.toString());

                    console.info('Finished.');
                    process.exit(0);
                });
            });
        });
    });
}

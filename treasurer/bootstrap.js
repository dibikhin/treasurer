const mongodb = require('mongodb');

const account_db_factory = require('./db/account_db');
const account_factory = require('./models/account').default.default;

const account_db = account_db_factory({
    driver: mongodb,
});

console.info('Starting...');

account_db
    .init({
        mongo_url: 'mongodb://localhost:27017',
        db_name: 'test',
        collection_name: 'accounts'
    })
    .then(x => {
        const account = account_factory({
            db: account_db
        });

        let params = {
            account_id: '5a885459ef5fa013c0abf723'
        };

        account.balance(params, (err, balance) => {
            if (err) { console.error(err); }
            console.info(balance.toString());

            params.spending = '0.125';

            account.withdraw(params, (err, acc) => {
                if (err) { console.error(err); }
                console.info(acc.value.amount.toString());

                params.refill = '1.0';

                account.deposit(params, (err, acc) => {
                    if (err) { console.error(err); }
                    console.info(acc.value.amount.toString());

                    console.info('Finished.');
                    process.exit(0);
                });
            });
        });
    });

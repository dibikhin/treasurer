const mongodb = require('mongodb');
const db = require('.././components/db');

(async function fill() {
    const mongo_opts = {
        mongo_url: 'mongodb://localhost:27017',
        db_name: 'test',
        collection_name: 'accounts'
    };
    const accounts = await db.connect({ driver: mongodb }, mongo_opts);

    const an_account = {
        balance: mongodb.Decimal128.fromString('289.125'),
        threshold: mongodb.Decimal128.fromString('0.125'),
        state: 'active',
        deleted: false,
        created_at: new Date(),
        updated_at: new Date()
    };
    const new_account = await accounts.insertOne(an_account);
    console.log('Inserted:');
    console.log(new_account.ops);
    process.exit(0);
})();

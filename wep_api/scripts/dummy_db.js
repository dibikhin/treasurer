const mongodb = require('mongodb')
const configs = require('.././configs')
const db = require('.././components/db');

(async function fill() {
    const accounts = await db.connect({ driver: mongodb }, configs.mongo)
    const an_account = {
        balance: mongodb.Decimal128.fromString('428.250'),
        threshold: mongodb.Decimal128.fromString('0.125'),
        state: 'active',
        deleted: false,
        created_at: new Date(),
        updated_at: new Date()
    }

    const new_account = await accounts.insertOne(an_account)

    console.log('Inserted:')
    console.log(new_account.ops)
    process.exit(0)
})()

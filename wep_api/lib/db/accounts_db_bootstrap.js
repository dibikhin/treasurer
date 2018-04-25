module.exports = {
    init
};

/**
* Connects to db
* @param    {object} ctx           Injected params
* @param    {object} ctx.driver
* @param    {object} opts          Connection options
* @returns  {promise}
*/
async function init(ctx, opts) {
    const client = await ctx.driver.MongoClient.connect(opts.mongo_url);
    const accounts = client.db(opts.db_name).collection(opts.collection_name);
    ctx.accounts = accounts; // WARN ctx.accounts maybe dead after mongo restart/down
    console.log('Connected successfully to MongoDB');
    return accounts;
}
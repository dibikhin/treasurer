module.exports = {
    connect
}

/**
* Connects to db
* @param    {object} ctx           Injected params
* @param    {object} ctx.driver
* @param    {object} opts          Connection options
*/
async function connect(ctx, opts) {
    const client = await ctx.driver.MongoClient.connect(opts.mongo_url)
    const collection = client.db(opts.db_name).collection(opts.collection_name)
    ctx[opts.collection_name] = collection // WARN ctx[opts.collection_name] maybe dead after mongo restart/down
    console.log('Connected to MongoDB')
    return collection
}

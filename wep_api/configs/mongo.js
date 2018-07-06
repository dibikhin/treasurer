const mongo_user = process.env.MONGO_USER || 'test';
const mongo_pass = process.env.MONGO_PASS || 'test';

// const mongo_url = 'mongodb://localhost:27017';
const mongo_url = `mongodb://${mongo_user}:${mongo_pass}@ds261969.mlab.com:61969/treasurer`;
const mongo_opts = {
    mongo_url,
    db_name: 'treasurer',
    collection_name: 'accounts'
};

module.exports = mongo_opts;
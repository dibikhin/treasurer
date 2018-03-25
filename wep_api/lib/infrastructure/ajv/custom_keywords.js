module.exports = add_keywords;

function add_keywords(params) {
    params.ajv_helpers.add_keyword(params.ajv, {
        keyword: 'mongo_object_id',
        is_valid: params.mongodb.ObjectID.isValid
    });
    params.ajv_helpers.add_keyword(params.ajv, {
        keyword: 'is_frozen',
        is_valid: Object.isFrozen
    });
    return params.ajv;
}

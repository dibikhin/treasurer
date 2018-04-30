module.exports = add_keywords;

function add_keywords({ mongodb, ajv, ajv_helpers }) {
    ajv_helpers.add_keyword(ajv, {
        keyword: 'mongo_object_id',
        is_valid: mongodb.ObjectID.isValid
    });
    ajv_helpers.add_keyword(ajv, {
        keyword: 'is_frozen',
        is_valid: Object.isFrozen
    });
    return ajv;
}

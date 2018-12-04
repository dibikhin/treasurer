module.exports = add_keywords

// TODO move ajv-dependent smw
function add_keywords({ mongo_is_valid, ajv, ajv_helpers }) {
    ajv_helpers.add_keyword(ajv, {
        keyword: 'mongo_object_id',
        is_valid: mongo_is_valid
    })
    ajv_helpers.add_keyword(ajv, {
        keyword: 'is_frozen',
        is_valid: Object.isFrozen
    })
    return ajv
}

module.exports = {
    create
}

function create({ params_validators, logger }) {
    return {
        dal: {
            params_freezer: Object.freeze, // strategy
            // params_validators
            // logger
        },
        model: {
            params_freezer: Object.freeze,
            params_validators
            // logger
        },
        controller: {
            // params_freezer
            // params_validators
            logger
        },
    }
}

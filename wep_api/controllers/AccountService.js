'use strict';

exports.add_account = function (args, res, next) {
    /**
     * parameters expected in the args:
    * body (CreateAccountRequest)
    **/
    var examples = {};
    examples['application/json'] = {
        "op_id": {},
        "account": {
            "created_at_utc": {},
            "updated_at_utc": "",
            "deleted": true,
            "balance": {},
            "threshold": "",
            "id": {},
            "status": {}
        }
    };
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    }
    else {
        res.end();
    }

}

exports.delete_account = function (args, res, next) {
    /**
     * parameters expected in the args:
    * account_id (String)
    **/
    // no response value expected for this operation
    res.end();
}

exports.get_account_by_id = function (args, res, next) {
    /**
     * parameters expected in the args:
    * account_id (String)
    **/
    var examples = {};
    examples = {
        "op_id": {},
        "account": {
            "created_at_utc": {},
            "updated_at_utc": "",
            "deleted": true,
            "balance": {},
            "threshold": "",
            "id": {},
            "status": {}
        }
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples, null, 2));
};

exports.update_account = function (args, res, next) {
    /**
     * parameters expected in the args:
    * body (UpdateAccountRequest)
    **/
    var examples = {};
    examples['application/json'] = {
        "op_id": {},
        "account": {
            "created_at_utc": {},
            "updated_at_utc": "",
            "deleted": true,
            "balance": {},
            "threshold": "",
            "id": {},
            "status": {}
        }
    };
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    }
    else {
        res.end();
    }

}

exports.update_account_with_form = function (args, res, next) {
    /**
     * parameters expected in the args:
    * account_id (String)
    * status (String)
    * threshold (BigDecimal)
    **/
    var examples = {};
    examples['application/json'] = {
        "op_id": {},
        "account": {
            "created_at_utc": {},
            "updated_at_utc": "",
            "deleted": true,
            "balance": {},
            "threshold": "",
            "id": {},
            "status": {}
        }
    };
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    }
    else {
        res.end();
    }

}


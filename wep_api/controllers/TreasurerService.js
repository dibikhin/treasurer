'use strict';

exports.balance = function(args, res, next) {
  /**
   * parameters expected in the args:
  * account_id (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "op_id" : { },
  "account_brief" : {
    "balance" : { },
    "id" : { }
  }
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.deposit = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (DepositRequest)
  **/
    var examples = {};
  examples['application/json'] = {
  "op_id" : { },
  "account_brief" : {
    "balance" : { },
    "id" : { }
  }
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.withdraw = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (WithdrawRequest)
  **/
    var examples = {};
  examples['application/json'] = {
  "op_id" : { },
  "account_brief" : {
    "balance" : { },
    "id" : { }
  }
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}


'use strict';
exports.__esModule = true;
var benalu_builder_1 = require('./benalu-builder');
function fromInstance(instance) {
    return new benalu_builder_1.BenaluBuilder(instance);
}
exports.fromInstance = fromInstance;
var core_1 = require('./core');
exports.Invocation = core_1.Invocation;

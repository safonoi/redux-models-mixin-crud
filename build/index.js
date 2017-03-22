'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notImplemented = exports.name = undefined;

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$apiCreator = _ref.apiCreator,
      apiCreator = _ref$apiCreator === undefined ? null : _ref$apiCreator,
      _ref$baseUrl = _ref.baseUrl,
      baseUrl = _ref$baseUrl === undefined ? null : _ref$baseUrl,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods;

  return {
    name: name,
    createMethods: function createMethods() {
      return apiCreator && typeof apiCreator.create === 'function' ? apiCreator.create({
        create: 'POST /',
        updateById: 'PUT /:id',
        patchById: 'PATCH /:id',
        deleteById: 'DELETE /:id',
        find: 'GET /',
        findById: 'GET /:id'
      }, { baseUrl: baseUrl }) : Object.assign({
        create: notImplemented,
        updateById: notImplemented,
        patchById: notImplemented,
        deleteById: notImplemented,
        find: notImplemented,
        findById: notImplemented
      }, methods);
    },
    createReducer: _reducer2.default,
    createSelectors: _selectors2.default
  };
};

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _selectors = require('./selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = exports.name = 'crud';
var notImplemented = exports.notImplemented = function notImplemented() {
  throw new Error('Method not implemented');
};

;
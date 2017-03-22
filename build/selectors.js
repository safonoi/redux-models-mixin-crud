'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports._findById = _findById;
exports._find = _find;
exports.default = createSelectors;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultResponse = { requesting: false, requested: false };

function _findById(modelSate, _ref) {
  var id = _ref.id;

  if (!modelSate || (0, _isEmpty2.default)(modelSate.byId)) {
    return defaultResponse;
  }

  return modelSate.byId[id] || defaultResponse;
}

function _find(modelSate) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!modelSate) {
    return defaultResponse;
  }

  var collections = modelSate.collections;
  var entry = collections.find(function (collection) {
    return (0, _isEqual2.default)(collection.params, params);
  });

  if (!entry) {
    return defaultResponse;
  }

  var result = (entry.ids || []).map(function (id) {
    return modelSate.byId[id];
  }).filter(function (record) {
    return record;
  });

  return _extends({}, entry, { result: result });
}

function createSelectors() {
  return {
    findById: function findById(_ref2) {
      var id = _ref2.id;

      return _findById(this.getMixinState(), { id: id });
    },
    findByIdResult: function findByIdResult(_ref3) {
      var id = _ref3.id;

      return _findById(this.getMixinState(), { id: id }).record || {};
    },
    find: function find() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return _find(this.getMixinState(), params);
    },
    findResult: function findResult() {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      return (_find(this.getMixinState(), params).result || []).map(function (_ref4) {
        var record = _ref4.record;
        return record;
      });
    }
  };
}
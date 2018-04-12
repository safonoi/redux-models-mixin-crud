'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createReducer;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * State schema:
 *
 * {
 *   byId: {
 *     [id]: {
 *       record: { entity object },
 *       requested: true,
 *       requesting: false,
 *       error: {}
 *     }
 *   },
 *   collections: [
 *     {
 *       params: { "primary key" },
 *       requested: true,
 *       requesting: false,
 *       error: {},
 *       ids: [1, 2, 3, 4, ...]
 *     },
 *     ...
 *   ]
 * }
 */

/**
 * @return {Function}
 */
function createReducer(model, _ref) {
  var CREATE_SUCCESS = _ref.CREATE_SUCCESS,
      UPDATE_BY_ID_START = _ref.UPDATE_BY_ID_START,
      UPDATE_BY_ID_SUCCESS = _ref.UPDATE_BY_ID_SUCCESS,
      UPDATE_BY_ID_ERROR = _ref.UPDATE_BY_ID_ERROR,
      PATCH_BY_ID_START = _ref.PATCH_BY_ID_START,
      PATCH_BY_ID_SUCCESS = _ref.PATCH_BY_ID_SUCCESS,
      PATCH_BY_ID_ERROR = _ref.PATCH_BY_ID_ERROR,
      DELETE_BY_ID = _ref.DELETE_BY_ID,
      DELETE_BY_ID_SUCCESS = _ref.DELETE_BY_ID_SUCCESS,
      DELETE_BY_ID_ERROR = _ref.DELETE_BY_ID_ERROR,
      FIND_START = _ref.FIND_START,
      FIND_SUCCESS = _ref.FIND_SUCCESS,
      FIND_ERROR = _ref.FIND_ERROR,
      FIND_BY_ID_START = _ref.FIND_BY_ID_START,
      FIND_BY_ID_SUCCESS = _ref.FIND_BY_ID_SUCCESS,
      FIND_BY_ID_ERROR = _ref.FIND_BY_ID_ERROR;


  /*
   * Initial states
   */

  var byIdInitialState = {};

  var byIdDocumentInitialState = {
    requesting: false,
    requested: false,
    error: null,
    record: null
  };

  var collectionInitialState = {
    requesting: false,
    params: {},
    ids: [],
    error: null
  };

  var collectionsInitialState = [];

  var modelInitialState = {
    byId: byIdInitialState,
    collections: collectionsInitialState
  };

  /*
   * Reducers
   */

  function byIdReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : byIdInitialState;
    var action = arguments[1];

    var id = null;

    if (action.payload && action.payload[0] && action.payload[0].id) {
      // byId methods (FIND_BY_ID, UPDATE_BY_ID, PATCH_BY_ID, DELETE_BY_ID)
      id = action.payload[0].id;
    } else if (action.meta && action.meta.id) {
      // try to find id in response
      id = action.meta.id;
    }

    var response = action.meta || null;

    switch (action.type) {
      case FIND_SUCCESS:
        return _extends({}, state, action.meta.reduce(function (records, record) {
          records[record.id] = _extends({}, byIdDocumentInitialState, {
            record: record,
            error: null,
            requesting: false,
            requested: true
          });

          return records;
        }, {}));

      case FIND_BY_ID_START:
      case UPDATE_BY_ID_START:
      case PATCH_BY_ID_START:
        return _extends({}, state, _defineProperty({}, id, _extends({}, state[id] || byIdDocumentInitialState, {
          requesting: true
        })));

      case CREATE_SUCCESS:
      case FIND_BY_ID_SUCCESS:
      case UPDATE_BY_ID_SUCCESS:
      case PATCH_BY_ID_SUCCESS:
        return _extends({}, state, _defineProperty({}, id, _extends({}, state[id] || byIdDocumentInitialState, {
          requesting: false,
          requested: true,
          record: response,
          error: null
        })));

      case FIND_BY_ID_ERROR:
        return _extends({}, state, _defineProperty({}, id, _extends({}, state[id] || byIdDocumentInitialState, {
          requesting: false,
          requested: true,
          error: response
        })));

      case DELETE_BY_ID_SUCCESS:
        return _extends({}, state, _defineProperty({}, id, undefined));

      default:
        return state;
    }
  }

  /*
   * Note: fetchTime of null means "needs fetch"
   */
  function collectionReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : collectionInitialState;
    var action = arguments[1];

    var params = action.payload;
    var response = action.meta || null;

    switch (action.type) {
      case FIND_START:
        return _extends({}, state, {
          requesting: true,
          params: params,
          error: null
        });

      case FIND_SUCCESS:
        return _extends({}, state, {
          requesting: false,
          requested: true,
          params: params,
          ids: response.filter(function (record) {
            return record;
          }).map(function (record) {
            return record.id;
          }),
          error: null
        });

      case FIND_ERROR:
        return _extends({}, state, {
          requesting: false,
          params: params,
          error: response
        });

      default:
        return state;
    }
  }

  function collectionsReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : collectionsInitialState;
    var action = arguments[1];

    var params = action.payload;

    switch (action.type) {

      case FIND_START:
      case FIND_SUCCESS:
      case FIND_ERROR:
        var findIndex = state.findIndex(function (collection) {
          return (0, _isEqual2.default)(collection.params, params);
        });

        if (findIndex === -1) {
          return [].concat(_toConsumableArray(state), [collectionReducer(collectionInitialState, action)]);
        }

        return [].concat(_toConsumableArray(state.slice(0, findIndex)), [collectionReducer(state[findIndex], action)], _toConsumableArray(state.slice(findIndex + 1, state.length)));

      case CREATE_SUCCESS:
      case DELETE_BY_ID_SUCCESS:
        return state.map(function (item) {
          return _extends({}, item);
        });

      default:
        return state;
    }
  }

  return function crudReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : modelInitialState;
    var action = arguments[1];

    switch (action.type) {

      case FIND_START:
      case FIND_SUCCESS:
      case FIND_ERROR:
        return _extends({}, state, {
          collections: collectionsReducer(state.collections, action),
          byId: byIdReducer(state.byId, action)
        });

      case FIND_BY_ID_START:
      case FIND_BY_ID_SUCCESS:
      case FIND_BY_ID_ERROR:
        return _extends({}, state, {
          byId: byIdReducer(state.byId, action)
        });

      case CREATE_SUCCESS:
        return _extends({}, state, {
          collections: collectionsReducer(state.collections, action),
          byId: byIdReducer(state.byId, action)
        });

      case UPDATE_BY_ID_START:
      case UPDATE_BY_ID_SUCCESS:
      case UPDATE_BY_ID_ERROR:
        return _extends({}, state, {
          byId: byIdReducer(state.byId, action)
        });

      case PATCH_BY_ID_START:
      case PATCH_BY_ID_SUCCESS:
      case PATCH_BY_ID_ERROR:
        return _extends({}, state, {
          byId: byIdReducer(state.byId, action)
        });

      case DELETE_BY_ID:
      case DELETE_BY_ID_SUCCESS:
      case DELETE_BY_ID_ERROR:
        return _extends({}, state, {
          byId: byIdReducer(state.byId, action),
          collections: collectionsReducer(state.collections, action)
        });

      default:
        return state;
    }
  };
}
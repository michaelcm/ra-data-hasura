'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sanitizeResource = void 0;
function isPrimitive(test) {
  return test !== Object(test);
}
const sanitizeResource = (data) => {
  // primitive no transformation needed (catches null, undefined, string, number, boolean)
  if (isPrimitive(data)) {
    return data;
  }
  // array, apply sanitizeResource to each element
  if (Array.isArray(data)) {
    return data.map(exports.sanitizeResource);
  }
  // default object, check each (key, value) pair
  return Object.entries(data).reduce((acc, [key, value]) => {
    var _a, _b;
    // intend to remove the following reserved names https://spec.graphql.org/draft/#sec-Names.Reserved-Names
    if (key.startsWith('__')) {
      return acc;
    }
    const newAcc = Object.assign({}, acc);
    // if it's an array of objects, we want to create a new key with the list of ids
    if (
      Array.isArray(value) &&
      ((_a = value === null || value === void 0 ? void 0 : value[0]) === null ||
      _a === void 0
        ? void 0
        : _a.id) &&
      ((_b = value === null || value === void 0 ? void 0 : value[0]) === null ||
      _b === void 0
        ? void 0
        : _b.id) !== null
    ) {
      newAcc[`${key}Ids`] = value.map((d) => d.id);
    }
    // if it's an object with an id, we want to create a new key with the id
    if (value === null || value === void 0 ? void 0 : value.id) {
      newAcc[`${key}.id`] = value.id;
    }
    return Object.assign(Object.assign({}, newAcc), {
      [key]: (0, exports.sanitizeResource)(value),
    });
  }, {});
};
exports.sanitizeResource = sanitizeResource;

/**
 * Creates an object composed of the picked object properties.
 * @param {Object} o
 * @param {string[]} k
 * @returns {Object}
 */
exports.pickExcept = (o, k) => {
  const r = {};
  const ok = Object.keys(o);
  for (let i = 0; i < ok.length; i++) {
    if (!k.includes(ok[i])) {
      r[ok[i]] = o[ok[i]];
    }
  }
  return r;
};

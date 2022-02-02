const _ = require('lodash');

/**
 * Merge default parameters from the Pelias config where the
 * query-string parameters are unset in the request URI.
 *
 * @param {object} defaults configuration from pelias/config
 * @param {object} groups groups of parameters to apply defaults for
*/
function _setup(defaults, groups) {

  // if inputs are invalid return a no-op sanitizer
  if (!_.isPlainObject(defaults) || !_.isArray(groups) || !groups.every(Array.isArray)) {
    return {
      sanitize: function sanitize(raw) {
        return { errors: [], warnings: [] };
      }
    };
  }

  return {
    sanitize: function sanitize(raw) {
      if (_.isPlainObject(raw)) {

        // iterate over each target parameter group
        groups.forEach(group => {

          // every member in the group must be unset to be considered 'empty'
          const empty = group.every(param => !raw.hasOwnProperty(param));

          // if the property isn't set in the request, but it is
          // set in the defaults, use the default value.
          if (empty) {

            // ensure every member in the group has a replacement
            const replacable = group.every(param => defaults.hasOwnProperty(param));

            // perform replacements
            if (replacable) {
              group.forEach(param => { raw[param] = defaults[param]; });
            }
          }
        });
      }

      return { errors: [], warnings: [] };
    }
  };
}

module.exports = _setup;

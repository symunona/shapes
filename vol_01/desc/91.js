/**
 * #89 - time series
 *
 * weeks
 */

const weeks = require('./time').time

module.exports = function (d) {

    weeks(d, 10, 8, Math.PI)

    d.save('time #5 - life in years')
}

/**
 * #89 - time series
 *
 * weeks
 */

const weeks = require('./time').time

module.exports = function (d) {

    weeks(d, 4, 13, Math.PI)

    d.save('time #4 - year - weeks')
}

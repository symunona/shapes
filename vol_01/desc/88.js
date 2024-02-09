/**
 * #87 - time series
 *
 * day - after work
 */

const time = require('./time').time

module.exports = function (d) {

    time(d, 6, 4, Math.PI * 0.7)

    d.save('time #2 - day after work')
}

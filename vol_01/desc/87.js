/**
 * #87 - time series
 *
 * day
 */

const time = require('./time').time

module.exports = function (d) {

    time(d, 6, 4, Math.PI)

    d.save('time #1 - day light')
}

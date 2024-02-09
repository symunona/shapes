/**
 * #89 - time series
 *
 * day - night owl
 */

const time = require('./time').time

module.exports = function (d) {

    time(d, 6, 4, Math.PI * 0.2)

    d.save('time #3 - night owl')
}

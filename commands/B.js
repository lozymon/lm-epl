const command = require('./command');

/**
 * Use this command to print standard bar codes.
 *
 * - Bar Code
 * - RSS-14 Bar Code
 *
 * @param x Horizontal start position
 * @param y Vertical start position
 * @param rotation Rotation
 *           Accepted Values:
 *           0 = normal (no rotation)
 *           1 = 90 degrees
 *           2 = 180 degrees
 *           3 = 270 degrees
 * @param barCode Bar Code selection
 * @param narrowBar Narrow bar width
 * @param wideBar Wide bar width
 *           Accepted Values: 2 - 30
 * @param barCodeHeight Bar code height
 * @param printHumanReadableCode Print human readable code
 *           Accepted Values:
 *           B = yes
 *           N = no
 * @param data Fixed data field
 * @returns {EPL}
 */
module.exports = function (x, y, rotation, barCode, narrowBar, wideBar, barCodeHeight, printHumanReadableCode, data) {
    const output = command('B', x, y, rotation, barCode, narrowBar, wideBar, barCodeHeight, printHumanReadableCode, `"${data}"`);

    if (this.output) {
        this.output += output
        return this;
    }

    return output;
};
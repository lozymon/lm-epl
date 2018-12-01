const command = require('./command');

/**
 * Use this command to select the print density. this density command controls
 * the amount of heat produced by the print head, More heat will produce a darker image. Too
 * much heat can cause the printed image to distort.
 *
 * @param density setting Accepted Value 0 - 15
 * @returns {EPL}
 */
module.exports = function (density) {
    const output = command('D', density);

    if (this.output) {
        this.output += output
        return this;
    }

    return output;
};
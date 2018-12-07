const command = require('./command');

/**
 * This command is used to delete soft fonts from memory
 *
 * @param fontname
 * @returns {EPL}
 */
module.exports = function (fontname = '*') {
    const output = command('EK', `"${fontname}"`);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
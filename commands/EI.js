const command = require('./command');

/**
 * This command will cause the printer to print a list of all soft fonts that are stored in memory
 *
 * @returns {EPL}
 */
module.exports = function () {
    const output = command('EI');

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
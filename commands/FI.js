const command = require('./command');

/**
 * This command will cause the printer to print a list of all forms stored in memory
 *
 * @returns {EPL}
 */
module.exports = function () {
    const output = command('FI');

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
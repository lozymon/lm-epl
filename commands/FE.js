const command = require('./command');

/**
 * This command is used to end a form store sequence.
 *
 * @returns {EPL}
 */
module.exports = function () {
    const output = command('FE');

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
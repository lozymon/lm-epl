const command = require('./command');

/**
 * This command allows the advanced programmer to specify the printer's
 * error/status report character for error reporting via the RS-232 serial interface
 *
 * @param character Any single ASCII character Accepted Values: 0255 decimal (00-FF hexadecimal)
 * @param error Error/Status Response Mode
 * @returns {EPL}
 */
module.exports = function (character, error) {
    const output = command('eR', character, error);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
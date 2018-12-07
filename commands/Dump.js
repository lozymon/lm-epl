const command = require('./command');

/**
 * This command allows the advanced programmer to force a user diagnostic
 * "data dump" mode. Sending the dump command to the printer allows the programmer to
 * compare actual data sent to printer with the host program.
 *
 * Send data to the printer after the dump command has been issued to evaluate program and
 * printer control data. The printer will process all data bytes into ASCII character data,
 * range 0-155 decimal (00-FF hexadecimal)
 *
 * Press the printer's Feed button until "Out of Dump" is printed to power cycle the printer to
 * terminate the dump mode.
 *
 * @returns {EPL}
 */
module.exports = function () {
    const output = command('dump', density);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
const command = require('./command');

/**
 * Use this command on an individual printer to provide precision cut placement to:
 *  - Compensate for small sensor to cutter position differences on a printer by printer basis
 *  - Fine-tune the cut position to compensate for differences in media.
 *
 *  Mobile printers, such as the TR 220, ignore this command.
 *
 *  When using the label liner cutter option, the printer will advance each printed label to the
 *  appropriate programmed offset cut position, between labels, before cutting. Due to media
 *  differences, the printer may not accurately position the labels before cutting, causing the cutter
 *  to cut the label instead of the liner.
 *
 * @param cutPositionIndex Cut position index measured in dots.
 *                         Accepted Values: 070 to 130
 *                         Accepted Values: 100.
 * @returns {EPL}
 */
module.exports = function (cutPositionIndex) {
    const output = command('f', cutPositionIndex);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
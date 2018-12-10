const command = require('./command');

/**
 * Use this command to provide precision tear, peel and cut placement to fine tune
 * the media positioning to compensate for differences in media and handling requirements.
 *
 * Mobile printers, such as the TR 220, ignore this command.
 *
 * @param mediaPositionOffset Media position offset measured in dots.
 *                            Accepted Values: 0–255
 *                            Default Value: 0
 * @returns {EPL}
 */
module.exports = function (mediaPositionOffset) {
    const output = command('fB', mediaPositionOffset);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
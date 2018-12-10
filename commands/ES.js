const command = require('./command');

/**
 * This command is used to download and store soft fonts in memory.
 *
 * @param fontName One lette
 *                 Accepted Values: a–z, lower case
 *                 Lower Case named fonts minimize soft font memory usage to
 *                 only store fonts downloaded and have 256 character limit.
 * @param numberOfCharacters Accepted Values: 00–FF hex (0–255 decimal) for 1 to 256
 *                           fonts per soft font set.
 * @param rotation Accepted Values:
 *                 00 hex = 0 and 180 degrees
 *                 01 hex = 90 and 270 degrees
 *                 02 hex = Both 0 and 180 degree rotation pair and the
 *                 90 and 270 degree rotation pair
 * @param fontHeight Accepted Values: 00–FF hex
 *                   Measured in dots and expressed as a hexadecimal number, i.e.
 *                   1B hex. = 27 dots.
 *                   Font height includes accentors and dissenters of characters
 *                   and need to fit in the character cell.
 *                    • 203 dpi printers = 256 dots = 1.26 in. = 32.03 mm
 *                    • 300 dpi printers = 00–FF hex.
 *                      256 dots = 0.85 in. = 21.67 mm
 * @param args
 * @returns {EPL}
 */
module.exports = function (fontName, numberOfCharacters, rotation, fontHeight, ...args) {
    const output = command('ES', numberOfCharacters, rotation, fontHeight, ...args);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
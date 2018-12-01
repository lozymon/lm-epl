const command = require('./command');

/**
 * Renders an ASCII text string to the image print buffer. See Text(Fonts)
 * on page 26 for discussion om text handling in Page Mode programming.
 *
 * Asian language EPL2 Page Mode printers have special firmware and printer (PCBA) memory
 * order options to support the large Asian character (ideogram) sets.
 *
 * The Latin (English etc.) font set (1-5, a-z and A-Z) are single-byte (8bits per byte) ASCII
 * character maps. The Asian characters are double-byte mapped characters. The printed Asian
 * character is dependent on the double-byte ASCII values.
 *
 * @param x Horizontal start position (X) in dots.
 * @param y Vertical start position (Y) in dots.
 * @param rotation
 *           Characters are organized vertically from left to right and then rotated to print.
 *
 *           Accepted Values:
 *           0 = normal (no rotation)
 *           1 = 90 degrees
 *           2 = 180 degrees
 *           3 = 270 degrees
 *
 *           Rotation for Asian Printers Only
 *           Characters are organized horizontally from top to bottom and
 *           then rotated to print. Asian printers support both horizontal
 *           and vertical character rotation.
 *
 *           Accepted Values (Asian Printers Only):
 *           4 = normal (no rotation)
 *           5 = 90 degrees
 *           6 = 180 degrees
 *           7 = 270 degrees
 * @param font Font selection
 * @param horizontalMultiplier Horizontal multiplier
 * @param verticalMultiplier Vertical multiplier
 * @param reverseImage Reverse image
 * @param data Fixed data field
 */
module.exports = function (x, y, rotation, font, horizontalMultiplier, verticalMultiplier, reverseImage, data) {
    data = data || '';
    data = data.replace("\\", "\\\\").replace("\"", "\\\"");

    const output = command('A', x, y, rotation, font, horizontalMultiplier, verticalMultiplier, reverseImage, `"${data}"`);

    if (this.output) {
        this.output += output
        return this;
    }

    return output;
};
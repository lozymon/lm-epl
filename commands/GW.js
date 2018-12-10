const command = require('./command');

/**
 * Use this command to load binary graphic data directly into the Image Buffer
 * memory for immediate printing. Theprinter does not store graphic data sent directly to the
 * image buffer.
 * The graphic data is lost when the image has finished printing, power is removed or the printer
 * is reset. Commands that size (Q and q) or clear (N and M) the image buffer will also remove
 * graphic image data.
 *
 * @param p1 Horizontal start position (X) in dots.
 * @param p2 Vertical start position (Y) in dots.
 * @param p3 Width of graphic in bytes. Eight (8) dots = one (1) byte of data.
 * @param p4 Length of graphic in dots (or print lines)
 * @param data Raw binary data without graphic file formatting. Data must
 *             be in bytes. Multiply the width in bytes (p3) by the number of
 *             print lines (p4) for the total amount of graphic data. The
 *             printer automatically calculates the exact size of the data
 *             block based upon this formula.
 * @returns {EPL}
 */
module.exports = function (p1, p2, p3, p4, data) {
    const output = command('GW', p1, p2, p3, p4, data);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
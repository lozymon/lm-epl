
/**
 * Use this command to print standard bar codes.
 *
 * - Aztec
 * - Aztec Mesa
 * - Data Matrix
 * - MaxiCode
 * - PDF417
 * - QR Code
 *
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @param p5
 * @param p6
 * @param p7
 * @param p8
 * @param data
 * @returns {EPL}
 */
module.exports = function (p1, p2, p3, p4, p5, p6, p7, p8, data) {
    const output = command('b', p1, p2, p3, p4, p5, p6, p7, p8, data);

    if (this.output) {
        this.output += output
        return this;
    }

    return output;
};
const command = require('./command');

/**
 *
 * @param p1 Conter number
 * @param p2 Maximum number of digits for counter
 * @param p3 Field Justification
 * @param p4 Steo Value
 * @param prompt KDU Propt Options
 * @returns {EPL}
 */
module.exports = function (p1, p2, p3, p4, prompt) {
    const output = command('C', p1, p2, p3, p4, prompt);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
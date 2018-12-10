const command = require('./command');

/**
 * Use this command to print a PCX (format) graphic that has been previously
 * stored in printer memory.
 *
 * @param p1 Horizontal start position (X) in dots.
 * @param p2 Vertical start position (Y) in dots.
 * @param name This is the graphic name used when the graphic was stored.
 *             This name can be supplied via variable data (V00 - V99).
 *              • The name may be up to 8 characters long.
 *              • Graphic names stored by the printer are case sensitive and
 *                will be stored exactly as entered with the GM command
 *                line; i.e. “GRAPHIC1”, “graphic1” and “graPHic1” are
 *                three different graphics when stored into the printer or
 *                when retrieved by the user.
 * @returns {EPL}
 */
module.exports = function (p1, p2, name) {
    const output = command('GG', p1, p2, name);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
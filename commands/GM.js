const command = require('./command');

/**
 * Use this command to store PCX graphics files in memory.
 *
 * @param name Graphic name This is the grahpic name that will be used when retrieving the
 *             stored graphic.
 *              • The name may be up to 8 characters long.
 *              • Graphic names stored by the printer are case sensitive and
 *                will be stored exactly as entered with the GM command
 *                line; i.e. “LOGO1”, “logo1” and “LoGo1” are three
 *                different graphics when stored into the printer or when
 *                retrieved by the user.
 *              • Deleting a single graphic requires that the
 *                GK”FORMNAME” command string be issued twice for
 *                each form deleted. Some label generation programs reissue
 *                graphics (graphic delete and store) every time a label
 *                is printed which will reduce flash memory life
 * @param p1 Use the DOS DIR command to determine the exact file size.
 * @returns {EPL}
 */
module.exports = function (name, p1) {
    const output = command('GM', `"${name}"`, p1);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
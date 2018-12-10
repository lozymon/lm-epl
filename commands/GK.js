const command = require('./command');

/**
 * Use this command to delete graphics from memory.
 *
 * @param name By entering the name of a graphic, that graphic will be deleted
 *             from memory.
 *              • Graphic names stored by the printer are case sensitive and
 *                will be stored exactly as entered with the GM command
 *                line; i.e. “LOGO1”, “logo1” and “LoGo1” are three
 *                different graphics when stored into the printer or when
 *                retrieved by the user.
 *              • Deleting a single graphic requires that the
 *                GK”FORMNAME” command string be issued twice for
 *                each form deleted. Some label generation programs reissue
 *                graphics (graphic delete and store) every time a label
 *                is printed which will reduce flash memory life.
 *
 *                “*” = Wild card By including an “*” (wild card), ALL graphics will be deleted
 *                      from memory. The GK”*” does not need to be issued twice to
 *                      delete all graphics.
 * @returns {EPL}
 */
module.exports = function (name) {
    const output = command('GK', `"${name}"`);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
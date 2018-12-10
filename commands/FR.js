const command = require('./command');

/**
 * Use this command to retrieve a form that was previously stored in memory.
 *
 * @param formName This is the form name used when the form was stored.
 *                  • The name may be up to 8 characters long.
 *                  • Form names stored by the printer are case sensitive and
 *                    will be stored exactly as entered on the FS command line;
 *                    i.e. “FORM1”, “form1” and “FoRm1” are three different
 *                    forms when stored into the printer or when retrieved by
 *                    the user.
 * @returns {EPL}
 */
module.exports = function (formName) {
    const output = command('FR', `"${formName}"`);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
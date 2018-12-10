const command = require('./command');

/**
 * This command is used to delete forms from memory
 *
 * @param formName By entering the name of a form, that form will be deleted
 *                 from memory.
 *                   • The namemay be up to 8 characters long.
 *                   • Form names stored by the printer are case sensitive and
 *                     will be stored exactly as entered on the FS command line;
 *                     i.e. “FORM1”, “form1” and “FoRm1” are three different
 *                     forms when stored into the printer or when retrieved by
 *                     the user.
 *                   • Deleting a single form requires the FK”FORMNAME” be
 *                     issued twice for each form to be deleted. Some label
 *                     generation programs re-issue forms (form delete and
 *                     store) every time a label is printed which reduces flash
 *                     memory life.
 *
 *                 “*” = Wild card
 *                       By including an “*” (wild card), ALL forms will be deleted from memory.
 *                       The FK”*” does not need to be issued twice to delete all forms.
 * @returns {EPL}
 */
module.exports = function (formName) {
    const output = command('FK', `"${formName}"`);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
const command = require('./command');

/**
 * This command begins a form store sequence.
 *  • All commands following FS will be stored in form memory until the FE command is
 *    received, ending the form store process.
 *  • Delete a form prior to updating the form by using the FK command. If a form (with the
 *    same name) is already stored in memory, issuing the FS command will result in an error
 *    and the previously stored form is retained.
 *  • To print a list of the forms currently stored in memory, use the FI command.
 *  • Data stored within a form can not have the Null (0 dec. 00 hex.) character as part of any
 *    data within that form.
 *  • A form will not store if insufficient memory is available. See the M command for details
 *    on adjusting and configuring memory for forms, graphics and soft fonts.
 *
 * @param formName
 * @returns {EPL}
 */
module.exports = function (formName) {
    const output = command('FS', `"${formName}"`);

    if (this.output) {
        this.output += output;
        return this;
    }

    return output;
};
const writeFileQueue = require('write-file-queue');
const writeQueue = {};

function EPL(options) {
    const self = this;
    this.output = '';

    self.options = {
        device: '',
    };

    for (let key in (options || {})) {
        if (options.hasOwnProperty(key)) {
            self.options[key] = options[key];
        }
    }

    /**
     * send data to given device
     *
     * @param callback
     * @returns {EPL}
     */
    self.sendToPrinter = function (callback) {
        const device = self.options.device;
        writeQueue[device] = writeQueue[device] || writeFileQueue({ retries: 300000 });
        writeQueue[device](device, self.output, callback);
        return self;
    };

    /**
     *
     * @param cmd
     * @param args
     * @private
     */
    const command = function (cmd, ...args) {
        let params = args.filter(x => x !== undefined).join(',');

        self.output += `${cmd}${params}\n`
    };

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
     * @constructor
     */
    self.Text = self.A = function (x, y, rotation, font, horizontalMultiplier, verticalMultiplier, reverseImage, data) {
        data = data || '';
        data = data.replace("\\", "\\\\").replace("\"", "\\\"");
        command('A', x, y, rotation, font, horizontalMultiplier, verticalMultiplier, reverseImage, `"${data}"`);
        return self;
    };

    /**
     * Use this command to print standard bar codes.
     *
     * - Bar Code
     * - RSS-14 Bar Code
     *
     * @param p1 Horizontal start position
     * @param p2 Vertical start position
     * @param p3 Rotation
     *           Accepted Values:
     *           0 = normal (no rotation)
     *           1 = 90 degrees
     *           2 = 180 degrees
     *           3 = 270 degrees
     * @param p4 Bar Code selection
     * @param p5 Narrow bar width
     * @param p6 Wide bar width
     *           Accepted Values: 2 - 30
     * @param p7 Bar code height
     * @param p8 Print human readable code
     *           Accepted Values:
     *           B = yes
     *           N = no
     * @param data Fixed data field
     * @returns {EPL}
     */
    self.B = function (p1, p2, p3, p4, p5, p6, p7, p8, data) {
        command('B', p1, p2, p3, p4, p5, p6, p7, p8, data);
        return self;
    };

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
    self.b = function (p1, p2, p3, p4, p5, p6, p7, p8, data) {
        command('b', p1, p2, p3, p4, p5, p6, p7, p8, data);
        return self;
    };

    /**
     *
     * @param p1 Conter number
     * @param p2 Maximum number of digits for counter
     * @param p3 Field Justification
     * @param p4 Steo Value
     * @param prompt KDU Propt Options
     * @returns {EPL}
     * @constructor
     */
    self.C = function (p1, p2, p3, p4, prompt) {
        command('C', p1, p2, p3, p4, prompt);
        return self;
    };

    /**
     * Use this command to select the print density. this density command controls
     * the amount of heat produced by the print head, More heat will produce a darker image. Too
     * much heat can cause the printed image to distort.
     *
     * @param p1 Density setting Accepted Value 0 - 15
     * @returns {EPL}
     * @constructor
     */
    self.Density = self.D = function (p1) {
        command('D', p1);
        return self;
    };

    /**
     * This command allows the advanced programmer to force a user diagnostic
     * "data dump" mode. Sending the dump command to the printer allows the programmer to
     * compare actual data sent to printer with the host program.
     *
     * Send data to the printer after the dump command has been issued to evaluate program and
     * printer control data. The printer will process all data bytes into ASCII character data,
     * range 0-155 decimal (00-FF hexadecimal)
     *
     * Press the printer's Feed button until "Out of Dump" is printed to power cycle the printer to
     * terminate the dump mode.
     *
     * @returns {EPL}
     */
    self.dump = function () {
        command('dump');
        return self;
    };

    /**
     * This command will cause the printer to print a list of all soft fonts that are stored in memory
     *
     * @returns {EPL}
     * @constructor
     */
    self.EI = function () {
        command('EI');
        return self;
    };

    /**
     * This command is used to delete soft fonts from memory
     *
     * @param fontname
     * @returns {EPL}
     * @constructor
     */
    self.EK = function (fontname = '*') {
        command('EK', `"${fontname}"`);
        return self;
    };

    /**
     * This command allows the advanced programmer to specify the printer's
     * error/status report character for error reporting via the RS-232 serial interface
     *
     * @param p1 Any single ASCII character Accepted Values: 0255 decimal (00-FF hexadecimal)
     * @param p2 Error/Status Response Mode
     * @returns {EPL}
     */
    self.eR = function (p1, p2) {
        command('eR', p1, p2);
        return self;
    };

    // self.ES = function (fontname, p1, p2, p3, p4, p5, p6, p7, p8, data) {
    //     command('ES', p1, p2, p3, p4, p5, p6, p7, p8, data);
    //     return self;
    // };

    /**
     * Use this command on an individual printer to provide precision cut placement to:
     *  - Compensate for small sensor to cutter position differences on a printer by printer basis
     *  - Fine-tune the cut position to compensate for differences in media.
     *
     *  Mobile printers, such as the TR 220, ignore this command.
     *
     *  When using the label liner cutter option, the printer will advance each printed label to the
     *  appropriate programmed offset cut position, between labels, before cutting. Due to media
     *  differences, the printer may not accurately position the labels before cutting, causing the cutter
     *  to cut the label instead of the liner.
     *
     * @param p1 Cut position index measured in dots.
     *           Accepted Values: 070 to 130
     *           Accepted Values: 100.
     * @returns {EPL}
     */
    self.f = function (p1) {
        command('f', p1);
        return self;
    };

    /**
     * Use this command to provide precision tear, peel and cut placement to fine tune
     * the media positioning to compensate for differences in media and handling requirements.
     *
     * Mobile printers, such as the TR 220, ignore this command.
     *
     * @param p1 Media position offset measured in dots.
     *           Accepted Values: 0–255
     *           Default Value: 0
     * @returns {EPL}
     */
    self.fB = function (p1) {
        command('fB', p1);
        return self;
    };

    /**
     * This command is used to end a form store sequence.
     *
     * @returns {EPL}
     * @constructor
     */
    self.FE = function () {
        command('FE');
        return self;
    };

    /**
     * This command will cause the printer to print a list of all forms stored in memory
     *
     * @returns {EPL}
     * @constructor
     */
    self.FI = function () {
        command('FI');
        return self;
    };

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
     * @constructor
     */
    self.FK = function (formName) {
        command('FK', `"${formName}"`);
        return self;
    };

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
     * @constructor
     */
    self.FR = function (formName) {
        command('FR', `"${formName}"`);
        return self;
    };

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
     * @param formName
     * @returns {EPL}
     * @constructor
     */
    self.FS = function (formName) {
        command('FS', `"${formName}"`);
        return self;
    };

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
     * @constructor
     */
    self.GG = function (p1, p2, name) {
        command('GG', p1, p2, name);
        return self;
    };

    /**
     * This command will cause the printer to print a list of all graphics stored in memory.
     *
     * @returns {EPL}
     * @constructor
     */
    self.GI = function () {
        command('GI');
        return self;
    };

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
     * @constructor
     */
    self.GK = function (name) {
        command('GK', `"${name}"`);
        return self;
    };

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
     * @constructor
     */
    self.GM = function (name, p1) {
        command('GM', `"${name}"`, p1);
        return self;
    };

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
     * @constructor
     */
    self.GW = function (p1, p2, p3, p4, data) {
        command('GW', p1, p2, p3, p4, data);
        return self;
    };

    /**
     * Places an adjustable inter-character space between Asian font characters, fonts
     * 8 and 9, only. The inter-character spacing gets multiplied with the text string by the selected
     * font’s horizontal and vertical multiplier values.
     *
     * @param p1 Space in dots between Asian characters
     *           Accepted Values: 0-9 (dots)
     *           Default Value: 0 (dots or no space)
     * @returns {EPL}
     */
    self.i = function (p1) {
        command('i', p1);
        return self;
    };

    /**
     * Use this command to select the appropriate character set for printing (and KDU display).
     *
     * @param p1 Number of data bits
     * @param p2 Printer Codepage/Language Support
     * @param p3 KDU Countyr Code
     * @returns {EPL}
     * @constructor
     */
    self.I = function (p1, p2, p3) {
        command('I', p1, p2, p3);
        return self;
    };

    /**
     * This command disables the Top Of Form Backup feature when printing
     * multiple labels. At power up, Top Of Form Backup will be enabled.
     *
     * @returns {EPL}
     * @constructor
     */
    self.JB = function () {
        command('JB');
        return self;
    };

    /**
     * This command disables the Top Of Form Backup feature for all operations.
     * Use this command for liner-less printing and special media cutting modes.
     * This command only is available in the 2824, 2844, and 3842 desktop printer
     * models at this time.
     *
     * @returns {EPL}
     * @constructor
     */
    self.JC = function () {
        command('JC');
        return self;
    };

    /**
     * This command enables the Top Of Form Backup feature and presents the last
     * label of a batch print operation. Upon request initiating the printing of the next form (or batch),
     * the last label backs up the Top Of Form before printing the next label.
     *
     * @returns {EPL}
     * @constructor
     */
    self.JF = function () {
        command('JF');
        return self;
    };

    /**
     * Use this command to draw lines with an “Exclusive OR” function. Any area,
     * line, image or field that this line intersects or overlays will have the image reversed or inverted
     * (sometimes known as reverse video or a negative image). In other words, all black will be
     * reversed to white and all white will be reversed to black within the line’s area (width and
     * length).
     *
     * @param p1 Horizontal start position (X) in dots
     * @param p2 Vertical start position (Y) in dots.
     * @param p3 Horizontal length in dots.
     * @param p4 Vertical length in dots.
     * @returns {EPL}
     * @constructor
     */
    self.JE = function (p1, p2, p3, p4) {
        command('JE', p1, p2, p3, p4);
        return self;
    };

    /**
     * Use this command to draw black lines, overwriting previous information.
     *
     * @param p1 Horizontal start position (X) in dots.
     * @param p2 Vertical start position (Y) in dots.
     * @param p3 Horizontal length in dots.
     * @param p4 Vertical length in dots.
     * @returns {EPL}
     * @constructor
     */
    self.LineDrawBlack = self.LO = function (p1, p2, p3, p4) {
        command('LO', p1, p2, p3, p4);
        return self;
    };

    /**
     * Use this command to draw diagonal black lines, overwriting previous information.
     *
     * @param p1 Horizontal start position (X) in dots.
     * @param p2 Vertical start position (Y) in dots.
     * @param p3 Horizontal length in dots.
     * @param p4 Vertical length in dots.
     * @param p5 Vertical end position (Y) in dots.
     * @returns {EPL}
     * @constructor
     */
    self.LS = function (p1, p2, p3, p4, p5) {
        command('LS', p1, p2, p3, p4, p5);
        return self;
    };

    /**
     * Use this command to draw white lines, effectively erasing previous information.
     *
     * @param p1 Horizontal start position (X) in dots.
     * @param p2 Vertical start position (Y) in dots.
     * @param p3 Horizontal length in dots.
     * @param p4 Vertical length in dots.
     * @returns {EPL}
     * @constructor
     */
    self.LW = function (p1, p2, p3, p4) {
        command('LS', p1, p2, p3, p4);
        return self;
    };

    /**
     * Printers except LP 2348 and LP 2348 Plus, with firmware version 4.32 and
     * above ignore this command. Use this command to set the size of form memory. The reminder
     * of the form storage memory will be shared by soft fonts and graphics data.
     *
     * @param p1 Parameter ignored, but required to process. Represents Image
     *           buffer size in whole KBytes.
     * @param p2 Form(s) memory size in whole KBytes. The parameter, p2
     *           (form memory size), inversely effects the size of the shared
     *           graphics/soft fonts memory.
     * @param p3 Parameter ignored, but required to process. Graphics (and soft
     *           font) memory size in whole Kbytes.
     * @returns {EPL}
     * @constructor
     */
    self.M = function (p1, p2, p3) {
        command('M', p1, p2, p3);
        return self;
    };

    /**
     * This command clears the image buffer prior to building a new label image.
     *
     * @returns {EPL}
     * @constructor
     */
    self.ClearImageBuffer = self.N = function () {
        command('N');
        return self;
    };

    /**
     * This command allows the user to cancel most printer customization parameters
     * set by o series commands.
     * @returns {EPL}
     * @constructor
     */
    self.O = function () {
        command('O');
        return self;
    };

    /**
     * This command allows the advanced programmer to disable bar code
     * optimization for rotated (90° & 270°) bar codes.
     *
     * @returns {EPL}
     */
    self.oB = function () {
        command('oB');
        return self;
    };

    /**
     * This command is a Page Mode (EPL2) command that allows the printer to set
     * alternate Line Mode font character sets. The fonts are activated by the oE command and are
     * intended for EPL1 emulation.
     *
     * @param p1 5 x 7 bitmap font - Normal (CCSET4)
     *           Line Mode EPL1 Compatibility Font A0
     *           Total character area is 8 x 11 dots
     * @param p2 5 x 7 bitmap font - Bold (CCSET4)
     *           Line Mode EPL1 Compatibility Font A0
     *           Total character area is 8 x 11 dots
     * @param p3 5 x 7 bitmap font - Doubled (CCSET4)
     *           Line Mode EPL1 Compatibility Font A0
     *           Total character size is 8 x 11 dots
     * @param p4 14 x 22 bitmap font - (CCSET1)
     *           Line Mode EPL1 Compatibility Font A
     *           Total character area is 16 x 26 dots
     * @param p5 10 x 18 bitmap font - (CCSET3)
     *           Line Mode EPL1 Compatibility Font A
     *           Total character area is 12 x 22 dots
     * @returns {EPL}
     */
    self.oE = function (p1, p2, p3, p4, p5) {
        command('oE', p1, p2, p3, p4, p5);
        return self;
    };

    /**
     * Use this command to place addition secondary, associated Macro PDF
     * symbols for the continuation of data greater than a single PDF 417 bar code can store.
     * This command must precede any PDF 417 bar code commands in order to print Macro PDF
     * (multiple bar code) symbols from a single b command’s data field.
     *
     * @param p1 Horizontal offset position (X) in dots of the next Macro PDF
     *           bar code symbol.
     * @param p2 Vertical offset position (Y) in dots of the next Macro PDF bar
     *           code symbol.
     * @returns {EPL}
     */
    self.oH = function (p1, p2) {
        command('oH', p1, p2);
        return self;
    };

    /**
     * This command disables the automatic label calibration routine executed by the
     * printer upon receiving the first escape command sequence from the Windows printer driver.
     * The printer normally measures a single label and sets the top of form prior to printing the first
     * label after a power-up reset. The Windows™ printer driver issues escape sequences when
     * printing.
     *
     * This command’s primary use is to save preprinted forms such as serialized labels, tags or
     * tickets.
     *
     * Mobile printers, such as the TR 220, ignore this command.
     *
     * @returns {EPL}
     */
    self.oM = function () {
        command('oM');
        return self;
    };

    /**
     * This command allows the advanced programmer to substitute the Euro
     * currency character for any ASCII character in printer resident font numbers 1-4.
     *
     * The second function this command supports is the zero character style toggling between a
     * plain zero character and a zero with a slash.
     *
     * Character substitution settings are stored in the printers non-volatile 'flash' memory. The
     * original character can be restored by sending the oR command without a parameter.
     *
     * None = No Parameters (p1/p2) resets to all code pages to original
     *        default character mapping.
     *        Optionally, to reapply normal character operations, issue a o
     *        (111 dec. or 6F hex.) command. See page 121 for important
     *        details on the effects of using this command.
     *
     * @param p1 = E
     *           If the p2 parameter is not provided, then the Euro character
     *           will map to code page position 213 decimal (D5 hexadecimal)
     *           for all code pages.
     *
     *           = 0 (zero)
     *           Toggles the zero character:
     *           slash — no slash (out of box default)
     * @param p2 Decimal number
     *           Accepted Values: 0 to 255
     *           The active code page’s ASCII character map position to be
     *           replaced by the Euro character. The Euro character will be
     *           active in this map position for all code pages. See the I
     *           command for details on code page selection.
     * @returns {EPL}
     */
    self.CharacterSubstitution = self.oR = function (p1, p2) {
        command('oR', p1, p2);
        return self;
    };

    /**
     * This command allows the advanced programmer to modify specific bar code
     * parameters to exceed the specified bar code’s design tolerances, i.e. reduce the bar code size.
     *
     * Note • Using the oW command may cause bar codes to become unreadable by some or all
     *        bar code scanners.
     *
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param p5
     * @returns {EPL}
     */
    self.oW = function (p1, p2, p3, p4, p5) {
        command('oW', p1, p2, p3, p4, p5);
        return self;
    };

    // self.o = function () {
    //     command('o');
    //     return self;
    // };

    /**
     * This command is used to switch the printer operating mode from Page Mode
     * (EPL2) to Line Mode (EPL1 emulation).
     *
     * Line Mode configuration setting is retained after reset has been issued or power has been
     * cycled.
     *
     * Mobile printers, such as the TR 220, ignore this command.
     *
     * @returns {EPL}
     * @constructor
     */
    self.OEPL1 = function () {
        command('OEPL1');
        return self;
    };

    /**
     * Use this command to print the contents of the image buffer.
     *
     * Note • The P command cannot be used inside of a stored form sequence. For automatic
     *        printing of stored forms, use the PA command.
     *
     * @param p1 Number of label sets Accepted Values: 1 to 65535
     * @param p2 Number of copies of each labael
     *           Accepted Values: 1 to 65535
     *           Number of copies of each label (used in combination with
     *           counters to print multiple copies of the same label).
     * @returns {EPL}
     * @constructor
     */
    self.Print = self.P = function (p1, p2) {
        command('P', p1, p2);
        return self;
    };

    /**
     * Use this command in a stored form sequence to automatically print the form
     * (as soon as all variable data has been supplied).
     *
     * @param p1 Number of label sets
     *           Can be variable data.
     *           Accepted Values: 1 to 9999
     * @param p2 Number of copies of the same label's
     *           Can be variable data.
     *           Accepted Values: 1 to 9999
     *           Sets the number of copies of each label (used in combination
     *           with counters) to print multiple copies of the same label. This
     *           value is only set when using counters.
     *
     * @returns {EPL}
     * @constructor
     */
    self.PA = function (p1, p2) {
        command('PA', p1, p2);
        return self;
    };

    self.autoFRKill = function () {
        self.FK('AUTOFR');
        return self;
    };

    self.autoFRSave = function () {
        self.FS('AUTOFR');
        return this;
    };

    self.getOutput = () => {
        return self.output;
    };

    self.setOutput = (output) => {
        self.output = output;
    };
}

module.exports = EPL;

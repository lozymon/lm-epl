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
        writeQueue[device] = writeQueue[device] || writeFileQueue({retries: 300000});
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
     * @param x Horizontal start position
     * @param y Vertical start position
     * @param rotation Rotation
     *           Accepted Values:
     *           0 = normal (no rotation)
     *           1 = 90 degrees
     *           2 = 180 degrees
     *           3 = 270 degrees
     * @param barCode Bar Code selection
     * @param narrowBar Narrow bar width
     * @param wideBar Wide bar width
     *           Accepted Values: 2 - 30
     * @param barCodeHeight Bar code height
     * @param printHumanReadableCode Print human readable code
     *           Accepted Values:
     *           B = yes
     *           N = no
     * @param data Fixed data field
     * @returns {EPL}
     */
    self.BarCode = self.B = function (x, y, rotation, barCode, narrowBar, wideBar, barCodeHeight, printHumanReadableCode, data) {
        command('B', x, y, rotation, barCode, narrowBar, wideBar, barCodeHeight, printHumanReadableCode, `"${data}"`);
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
    self.BarCode2D = self.b = function (p1, p2, p3, p4, p5, p6, p7, p8, data) {
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
     */
    self.Counter = self.C = function (p1, p2, p3, p4, prompt) {
        command('C', p1, p2, p3, p4, prompt);
        return self;
    };

    /**
     * Use this command to select the print density. this density command controls
     * the amount of heat produced by the print head, More heat will produce a darker image. Too
     * much heat can cause the printed image to distort.
     *
     * @param density setting Accepted Value 0 - 15
     * @returns {EPL}
     */
    self.Density = self.D = function (density) {
        command('D', density);
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
    self.Dump = function () {
        command('dump');
        return self;
    };

    /**
     * This command will cause the printer to print a list of all soft fonts that are stored in memory
     *
     * @returns {EPL}
     */
    self.PrintSoftFontInformation = self.EI = function () {
        command('EI');
        return self;
    };

    /**
     * This command is used to delete soft fonts from memory
     *
     * @param fontname
     * @returns {EPL}
     */
    soft.DeleteSoftFont = self.EK = function (fontname = '*') {
        command('EK', `"${fontname}"`);
        return self;
    };

    /**
     * This command allows the advanced programmer to specify the printer's
     * error/status report character for error reporting via the RS-232 serial interface
     *
     * @param character Any single ASCII character Accepted Values: 0255 decimal (00-FF hexadecimal)
     * @param error Error/Status Response Mode
     * @returns {EPL}
     */
    self.UserDefinedError = self.eR = function (character, error) {
        command('eR', character, error);
        return self;
    };

    /**
     * This command is used to download and store soft fonts in memory.
     *
     * @param fontname One lette
     *                 Accepted Values: a–z, lower case
     *                 Lower Case named fonts minimize soft font memory usage to
     *                 only store fonts downloaded and have 256 character limit.
     * @param numberOfCharacters Accepted Values: 00–FF hex (0–255 decimal) for 1 to 256
     *                           fonts per soft font set.
     * @param rotation Accepted Values:
     *                 00 hex = 0 and 180 degrees
     *                 01 hex = 90 and 270 degrees
     *                 02 hex = Both 0 and 180 degree rotation pair and the
     *                 90 and 270 degree rotation pair
     * @param fontHeight Accepted Values: 00–FF hex
     *                   Measured in dots and expressed as a hexadecimal number, i.e.
     *                   1B hex. = 27 dots.
     *                   Font height includes accentors and dissenters of characters
     *                   and need to fit in the character cell.
     *                    • 203 dpi printers = 256 dots = 1.26 in. = 32.03 mm
     *                    • 300 dpi printers = 00–FF hex.
     *                      256 dots = 0.85 in. = 21.67 mm
     * @param args
     * @returns {EPL}
     */
    self.StoreSoftFont = self.ES = function (fontname, numberOfCharacters, rotation, fontHeight, ...args) {
        command('ES', numberOfCharacters, rotation, FontHeight, ...args);
        return self;
    };

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
     * @param cutPositionIndex Cut position index measured in dots.
     *                         Accepted Values: 070 to 130
     *                         Accepted Values: 100.
     * @returns {EPL}
     */
    self.CutPosition = self.f = function (cutPositionIndex) {
        command('f', cutPositionIndex);
        return self;
    };

    /**
     * Use this command to provide precision tear, peel and cut placement to fine tune
     * the media positioning to compensate for differences in media and handling requirements.
     *
     * Mobile printers, such as the TR 220, ignore this command.
     *
     * @param mediaPositionOffset Media position offset measured in dots.
     *                            Accepted Values: 0–255
     *                            Default Value: 0
     * @returns {EPL}
     */
    self.AdjustBackupPosition = self.fB = function (mediaPositionOffset) {
        command('fB', mediaPositionOffset);
        return self;
    };

    /**
     * This command is used to end a form store sequence.
     *
     * @returns {EPL}
     */
    self.EndFormStore = self.FE = function () {
        command('FE');
        return self;
    };

    /**
     * This command will cause the printer to print a list of all forms stored in memory
     *
     * @returns {EPL}
     */
    self.PrintFormInformation = self.FI = function () {
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
     */
    self.DeleteForm = self.FK = function (formName) {
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
     */
    self.RetrieveForm = self.FR = function (formName) {
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
     *
     * @param formName
     * @returns {EPL}
     */
    self.StoreForm = self.FS = function (formName) {
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
     */
    self.PrintGraphics = self.GG = function (p1, p2, name) {
        command('GG', p1, p2, name);
        return self;
    };

    /**
     * This command will cause the printer to print a list of all graphics stored in memory.
     *
     * @returns {EPL}
     */
    self.PrintGraphicsInformation = self.GI = function () {
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
     */
    self.DeleteGraphics = self.GK = function (name) {
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
     */
    self.StoreGraphics = self.GM = function (name, p1) {
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
     */
    self.DirectGraphicWrite = self.GW = function (p1, p2, p3, p4, data) {
        command('GW', p1, p2, p3, p4, data);
        return self;
    };

    /**
     * Places an adjustable inter-character space between Asian font characters, fonts
     * 8 and 9, only. The inter-character spacing gets multiplied with the text string by the selected
     * font’s horizontal and vertical multiplier values.
     *
     * @param space Space in dots between Asian characters
     *           Accepted Values: 0-9 (dots)
     *           Default Value: 0 (dots or no space)
     * @returns {EPL}
     */
    self.AsianCharacterSpacing = self.i = function (space) {
        command('i', space);
        return self;
    };

    /**
     * Use this command to select the appropriate character set for printing (and KDU display).
     *
     * @param number Number of data bits
     * @param printer Printer Codepage/Language Support
     * @param kduCode KDU Countyr Code
     * @returns {EPL}
     */
    self.CharacterSetSelection = self.I = function (number, printer, kduCode) {
        command('I', number, printer, kduCode);
        return self;
    };

    /**
     * This command disables the Top Of Form Backup feature when printing
     * multiple labels. At power up, Top Of Form Backup will be enabled.
     *
     * @returns {EPL}
     */
    self.DisableTopOfFormBackup = self.JB = function () {
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
     */
    self.DisableTopOfFormBackupAllCases = self.JC = function () {
        command('JC');
        return self;
    };

    /**
     * This command enables the Top Of Form Backup feature and presents the last
     * label of a batch print operation. Upon request initiating the printing of the next form (or batch),
     * the last label backs up the Top Of Form before printing the next label.
     *
     * @returns {EPL}
     */
    self.EnableTopOfFormBackup = self.JF = function () {
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
     * @param x Horizontal start position (X) in dots
     * @param y Vertical start position (Y) in dots.
     * @param horizontalLength Horizontal length in dots.
     * @param verticalLength Vertical length in dots.
     * @returns {EPL}
     */
    self.LineDrawExclusiveOR = self.JE = function (x, y, horizontalLength, verticalLength) {
        command('JE', x, y, horizontalLength, verticalLength);
        return self;
    };

    /**
     * Use this command to draw black lines, overwriting previous information.
     *
     * @param x Horizontal start position (X) in dots.
     * @param y Vertical start position (Y) in dots.
     * @param horizontalLength Horizontal length in dots.
     * @param verticalLength Vertical length in dots.
     * @returns {EPL}
     */
    self.LineDrawBlack = self.LO = function (x, y, horizontalLength, verticalLength) {
        command('LO', x, y, horizontalLength, verticalLength);
        return self;
    };

    /**
     * Use this command to draw diagonal black lines, overwriting previous information.
     *
     * @param x Horizontal start position (X) in dots.
     * @param y Vertical start position (Y) in dots.
     * @param horizontalLength Horizontal length in dots.
     * @param verticalLength Vertical length in dots.
     * @param verticalEndPosition Vertical end position (Y) in dots.
     * @returns {EPL}
     */
    self.LineDrawDiagonal = self.LS = function (x, y, horizontalLength, verticalLength, verticalEndPosition) {
        command('LS', x, y, horizontalLength, verticalLength, verticalEndPosition);
        return self;
    };

    /**
     * Use this command to draw white lines, effectively erasing previous information.
     *
     * @param x Horizontal start position (X) in dots.
     * @param y Vertical start position (Y) in dots.
     * @param horizontalLength Horizontal length in dots.
     * @param verticalLength Vertical length in dots.
     * @returns {EPL}
     */
    self.LineDrawWhite = self.LW = function (x, y, horizontalLength, verticalLength) {
        command('LS', x, y, horizontalLength, verticalLength);
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
     */
    self.MemoryAllocation = self.M = function (p1, p2, p3) {
        command('M', p1, p2, p3);
        return self;
    };

    /**
     * This command clears the image buffer prior to building a new label image.
     *
     * @returns {EPL}
     */
    self.ClearImageBuffer = self.N = function () {
        command('N');
        return self;
    };

    /**
     * This command allows the user to cancel most printer customization parameters
     * set by o series commands.
     * @returns {EPL}
     */
    self.CancelSoftwareOptions = self.O = function () {
        command('O');
        return self;
    };

    /**
     * This command allows the advanced programmer to disable bar code
     * optimization for rotated (90° & 270°) bar codes.
     *
     * @returns {EPL}
     */
    self.CancelAutoBarCodeOptimization = self.oB = function () {
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
    self.LineModeFontSubstitution = self.oE = function (p1, p2, p3, p4, p5) {
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
    self.MacroPDFOffset = self.oH = function (p1, p2) {
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
    self.DisableInitialEscSequenceFeed = self.oM = function () {
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
    self.CustomizeBarCodeParameters = self.oW = function (p1, p2, p3, p4, p5) {
        command('oW', p1, p2, p3, p4, p5);
        return self;
    };

    /**
     * Use this command to select various printer options. Options available vary by
     * printer configuration.
     *
     * Options selected and enabled in a printer can be verified by checking the printer configuration
     * printout, Dump Mode printer status label. See the U command on page 146 and the
     * Explanation of the Status Printout on page 34.
     *
     * Mobile printers, such as the TR 220, ignore this command.
     *
     * @param args
     * @returns {EPL}
     */
    self.HardwareOptions = self.o = function (...args) {
        command('o', ...args);
        return self;
    };

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
     */
    self.SetLineMode = self.OEPL1 = function () {
        command('OEPL1');
        return self;
    };

    /**
     * Use this command to print the contents of the image buffer.
     *
     * Note • The P command cannot be used inside of a stored form sequence. For automatic
     *        printing of stored forms, use the PA command.
     *
     * @param numberOfLabel Number of label sets Accepted Values: 1 to 65535
     * @param numberOfCopies Number of copies of each labael
     *           Accepted Values: 1 to 65535
     *           Number of copies of each label (used in combination with
     *           counters to print multiple copies of the same label).
     * @returns {EPL}
     */
    self.Print = self.P = function (numberOfLabel, numberOfCopies) {
        command('P', numberOfLabel, numberOfCopies);
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
     */
    self.PrintAutomatic = self.PA = function (p1, p2) {
        command('PA', p1, p2);
        return self;
    };

    /**
     * Use this command to set the width of the printable area of the media.
     *
     * @param width The q command will cause the image buffer to reformat and
     *              position to match the selected label width (p1)
     * @returns {EPL}
     */
    self.SetLabelWidth = self.q = function (width) {
        commanf('q', width);
        return self;
    }

    /**
     * Use this command to set the form and gap length or black line thickness when
     * using the transmissive (gap) sensor, black line sensor, or for setting the printer into the
     * continuous media print mode.
     *
     * The Q command will cause the printer to recalculate and reformat image buffer.
     *
     * @param lableLength Default Value: Set by the AutoSense of media
     *                    Accepted Values: 0-65535
     *                     • Distance between edges of the label or black line marks.
     *                     • For continuous mode, the p1 parameter sets the feed
     *                    distance between the end of one form and beginning of the
     *                    next.
     * @param gapLength Accepted Values:
     *                     16-240 (dots) for 203 dpi printers
     *                     18-240 (dots) for 300dpi printers
     *
     *                  Gap Mode:
     *                  By default, the printer is in Gap mode and parameters are set
     *                  with the media AutoSense.
     *
     *                  Black Line Mode:
     *                  Set p2 to B plus black line thickness in dots. See the Gap
     *                  mode range.
     *
     *                  Continuous Media Mode:
     *                  Set p2 to 0 (zero)The transmissive (gap) sensor will beused to
     *                  detect the end of media.
     * @param offsetLength Required for black line mode operation.
     *                     Optional for Gap detect or continuous media modes. Use only
     *                     positive offset values.
     * @returns {EPL}
     */
    self.SetFormLength = self.Q = function (lableLength, gapLength, offsetLength) {
        commanf('Q', lableLength, gapLength, offsetLength);
        return self;
    }

    /**
     * Use this command to disable or reenable the double buffer image (label)
     * printing. The double buffer feature is a automatically tested and set by the q and Q commands.
     *
     * Mobile printers, such as the TR 220, ignore this command and automatically set the printer to
     * single buffer mode.
     *
     * @param mode Accepted Values:
     *              N = Disable double buffer mode
     *              Y = Re-enable the double buffer mode if the printer
     *                  memory supports the image buffer size set by Q and q
     *                  parameters
     * @returns {EPL}
     */
    self.SetDoubleBufferMode = self.r = function (mode) {
        commanf('r', mode);
        return self;
    }

    /**
     * Use this command to move the reference point for the X and Y axes. All
     * horizontal and vertical measurements in other commands use the setting for R as the origin for
     * measurements. Use the R command as an alternative to sending the q command to position
     * (center) labels that are narrower than the print head.
     *
     * The R command interacts with image buffer setting, as follows:
     *  • The R command forces the printer to use the full width of the print head as the width of the
     *    image buffer. The R command overrides the q commands print width setting.
     *  • Rotate the image buffer with the Z command to establish top and left margins (ZT) or the
     *    bottom and right margins (ZB).
     *  • When positioned correctly, prevents printing off two (2) edges of the label opposite the 0,0
     *    reference point
     *
     * @param horizontalLeftMargin Horizontal (left) margin measured in dots.
     * @param verticalTopMargin Vertical (top) margin measured in dots.
     * @returns {EPL}
     */
    self.SetReferencePoint = self.R = function (horizontalLeftMargin, verticalTopMargin) {
        commanf('R', horizontalLeftMargin, verticalTopMargin);
        return self;
    }

    /**
     * Use this command to select the print speed.
     *
     * Mobile printers, such as the TR 220, ignore this command and automatically set speed to
     * optimize battery use.
     *
     * @param speed
     * @returns {EPL}
     */
    self.SpeedSelect = self.S = function (speed) {
        commanf('S', speed);
        return self;
    }

    /**
     * Use this command to define the date format and print date data. The TD
     * variable is inserted within a Text or Bar Code command's DATA parameter to print the date.
     * The TD variable supports offsetting day by up to 253 days (see examples below for usage).
     *
     * This command only works in printers equipped with the Real Time Clock time and date
     * option.
     *
     * Power-Up Default Format - mn-dd-y4
     *
     * @param p1
     * @param p2
     * @param p3
     */
    self.DateRecallFormatLayout = self.TD = function (p1, p2, p3) {
        commanf('TD', p1, p2, p3);
        return self;
    }

    /**
     * Use this command to set the time and date in printers equipped with the Real
     * Time Clock option.
     * 
     * @param month Accepted Values: 01–12
     * @param day Accepted Values: 01–31
     * @param year Value is equivalent to the last two digits of Year (e.g. 95)
     *             Accepted Values:
     *             90-99 (to indicate 1990-1999)
     *             00-89 (to indicate 2000-2089)
     * @param hour Shown in 24 hour format.
     *             Accepted Values: 00–23
     * @param minutes Accepted Values: 00–59
     * @param seconds Accepted Values: 00–59
     * @returns {EPL}
     */
    self.SetRealTimeClock = self.TS = function (month, day, year, hour, minutes, seconds) {
        commanf('TS', month, day, year, hour, minutes, seconds);
        return self;
    }

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

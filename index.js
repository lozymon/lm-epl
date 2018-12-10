const {spawn} = require('child_process');
const fs = require('fs');
const writeFileQueue = require('write-file-queue');
const writeQueue = {};
const A = require('./commands/A');
const B = require('./commands/B');
const b = require('./commands/b2D');
const C = require('./commands/C');
const D = require('./commands/D');
const Dump = require('./commands/Dump');
const EI = require('./commands/EI');
const EK = require('./commands/EK');
const eR = require('./commands/eR');
const ES = require('./commands/ES');
const f = require('./commands/f');
const fB = require('./commands/fB');
const FE = require('./commands/FE');
const FK = require('./commands/FK');
const FR = require('./commands/FR');
const FS = require('./commands/FS');
const GG = require('./commands/GG');
const GI = require('./commands/GI');
const GK = require('./commands/GK');
const GM = require('./commands/GM');
const GW = require('./commands/GW');

function EPL(options) {
    const self = this;
    this.output = '';

    self.options = {
        device: '',
        debug: false,
        samba: '',
        samba_temp: '',
        samba_user: '',
        samba_password: ''
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
        const {device, samba, samba_user, samba_password, samba_temp, debug} = self.options;
        if (device && String(device).length > 0) {
            writeQueue[device] = writeQueue[device] || writeFileQueue({retries: 300000});
            writeQueue[device](device, self.output, callback);
        } else if (samba && String(samba).length > 0) {
            if (samba_temp && String(samba_temp).length > 0) {
                const tmp = `${samba_temp}/${Math.random().toString(36).substr(2, 32)}.epl`;

                if (debug) {
                    console.log('samba_temp --> ', tmp);
                }

                writeQueue[tmp] = writeQueue[tmp] || writeFileQueue({retries: 300000});
                writeQueue[tmp](tmp, self.output, () => {

                    const sambash = `${__dirname}/samba.sh`;
                    if (debug) {
                        console.log('samba command --> ', [sambash, samba, samba_password, samba_user, tmp]);
                    }

                    const sh = spawn('sh', [sambash, samba, samba_password, samba_user, tmp]);

                    sh.stdout.on('data', (data) => {
                        if (debug) {
                            console.log(`stdout: ${data}`);
                        }
                    });

                    sh.stderr.on('data', (data) => {
                        if (debug) {
                            console.log(`stderr: ${data}`);
                        }
                    });

                    sh.on('close', function (...args) {
                        if (debug) {
                            console.log('samba close --> ', ...args);
                        }

                        callback(...args)
                    })
                });
            }
        }

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

    self.Text = self.A = A.bind(self);
    self.BarCode = self.B = B.bind(self);
    self.BarCode2D = self.b = b.bind(self);
    self.Counter = self.C = C.bind(self);
    self.Density = self.D = D.bind(self);
    self.Dump = Dump.bind(self);
    self.PrintSoftFontInformation = self.EI = EI.bind(self);
    self.DeleteSoftFont = self.EK = EK.bind(self);
    self.UserDefinedError = self.eR = eR.bind(self);
    self.StoreSoftFont = self.ES = ES.bind(self);
    self.CutPosition = self.f = f.bind(self);
    self.AdjustBackupPosition = self.fB = fB.bind(self);
    self.EndFormStore = self.FE = FE.bind(self);
    self.PrintFormInformation = self.FI = FI.bind(self);
    self.DeleteForm = self.FK = FK.bind(self);
    self.RetrieveForm = self.FR = FR.bind(self);
    self.StoreForm = self.FS = FS.bind(self);
    self.PrintGraphics = self.GG = GG.bind(self);
    self.PrintGraphicsInformation = self.GI = GI.bind(self);
    self.DeleteGraphics = self.GK = GK.bind(self);
    self.StoreGraphics = self.GM = GM.bind(self);
    self.DirectGraphicWrite = self.GW = GW.bind(self);

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
        command('q', width);
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
        command('Q', lableLength, gapLength, offsetLength);
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
        command('r', mode);
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
        command('R', horizontalLeftMargin, verticalTopMargin);
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
        command('S', speed);
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
        command('TD', p1, p2, p3);
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
        command('TS', month, day, year, hour, minutes, seconds);
        return self;
    }

    /**
     * Use this command to define the time format and print time data. The TT
     * variable is inserted within a Text or Bar Code command's DATA parameter to print the time.
     *
     * This command works only in printers equipped with the Real Time Clock (RTC) time and date
     * option.
     *
     * @param hour  Hours displayed as 2 digits (e.g. 01)
     * @param minutes Minutes displayed as 2 digits (e.g. 15)
     * @param seconds  Seconds displayed as 2 digits (e.g. 00)
     * @returns {EPL}
     */
    self.TimeRecallFormatLayout = self.TT = function (hour, minutes, seconds) {
        command('TT', hour, minutes, seconds);
        return self;
    }

    /**
     * Use this command to print the current printer configuration for page mode
     * printing. The printout is the same the Dump Mode printout initiated by the printer’s AutoSense
     * routine. The printer does not enter Dump Mode. See Explanation of the Status Printout
     * on page 34 for a description of this printout.
     *
     * @returns {EPL}
     */
    self.PrintConfigurationGeneral = self.U = function () {
        command('U');
        return self;
    }

    /**
     * This command sets the printer to clear (empty) the print buffer if a media out
     * condition is detected.
     *
     * A power cycle, reset, or UB command will clear this setting.
     *
     * Normal (default) operation for the printer is to resume printing if the empty roll is replaced
     * with new roll (or ribbon) and finish print any labels in the process of printing prior to a media
     * out condition, including batch print jobs.
     *
     * @returns {EPL}
     */
    self.EnableClearLabelCounterMode = self.UA = function () {
        command('UA');
        return self;
    }

    /**
     * Use this command to clear the UA command and restore the default setting to
     * allow the printer to resume printing a batch job if a paper empty occurs. The page mode
     * (EPL2) printer, by default, will resume printing if the empty roll is replaced with new roll (or
     * ribbon) and finish a batch print job.
     *
     * @returns {EPL}
     */
    self.ResetLabelCounterMode = self.UB = function () {
        command('UB');
        return self;
    }

    /**
     * This command will cause the printer to send information about external fonts
     * currently stored in the printer back to the host.
     * The printer will send the number of external fonts stored and each font’s name, height and
     * direction, to the host through the RS-232 port.
     *
     * @returns {EPL}
     */
    self.ExternalFontInformationInquiry = self.UE = function () {
        command('UE');
        return self;
    }

    /**
     * This command will cause the printer to send information about forms currently
     * stored in the printer back to the host.
     *
     * @returns {EPL}
     */
    self.ExternalFontInformationInquiry = self.UF = function () {
        command('UF');
        return self;
    }

    /**
     * This command will cause the printer to send information about graphics
     * currently stored in the printer back to the host.
     *
     * @returns {EPL}
     */
    self.GraphicsInformationInquiry = self.UG = function () {
        command('UG');
        return self;
    }

    /**
     * This command will cause the printer to enable prompts to be sent to the host
     * and it will send the currently selected codepage to the host through the RS-232 port.
     *
     * This command also disables software flow control (XON/XOFF). Hardware flow control is
     * not disabled (DTR/CTS). To restart software flow control a reset (^@ command) or power
     * must be recycled.
     *
     * See also the I and U commands.
     *
     * @param numberOfDataBits
     * @param codePage
     * @param countryCode
     * @returns {EPL}
     */
    self.HostPromptsCodepageInquiry = self.UI = function (numberOfDataBits, codePage, countryCode) {
        command('UI', numberOfDataBits, codePage, countryCode);
        return self;
    }

    /**
     * Use this command to select the print orientation
     *
     * @param orientation Accepted Values:
     *                    T = Printing from top of image buffer.
     *                    B = Printing from bottom of image buffer.
     *                    Default Value: T
     * @returns {EPL}
     */
    self.PrintDirection = self.Z = function (orientation) {
        command('Z', orientation);
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

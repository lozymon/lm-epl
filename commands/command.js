/**
 *
 * @param cmd
 * @param args
 * @private
 */
module.exports = function (cmd, ...args) {
    let params = args.filter(x => x !== undefined).join(',');

    return `${cmd}${params}\n`
};
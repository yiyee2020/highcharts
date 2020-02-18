/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Popup dialog for data filter.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* eslint-disable no-invalid-this, valid-jsdoc */
import PopupDialog from './PopupDialog.js';
/**
 * @private
 */
var DataFilterDialog = /** @class */ (function () {
    function DataFilterDialog(chart) {
        this.dialog = new PopupDialog(chart.renderTo);
    }
    DataFilterDialog.prototype.buildContent = function (options) {
        this.dialog.setContent(this.getDialogContent(options));
    };
    DataFilterDialog.prototype.show = function () {
        this.dialog.show();
    };
    DataFilterDialog.prototype.destroy = function () {
        this.dialog.destroy();
    };
    DataFilterDialog.prototype.getDialogContent = function (options) {
        return "\n            <p style=\"font-size:1.4em\">Filter data</p>\n            <p>Currently showing 50 of 50 points</p>\n            <select>\n                <option>State name</option>\n                <option>Value</option>\n                <option>Postal Code</option>\n            </select>\n            <select>\n                <option>Equals</option>\n                <option>Contains</option>\n                <option>Starts with</option>\n            </select>\n            <input>\n            <button>Reset</button>\n            <button>Apply</button>\n        ";
    };
    return DataFilterDialog;
}());
export default DataFilterDialog;

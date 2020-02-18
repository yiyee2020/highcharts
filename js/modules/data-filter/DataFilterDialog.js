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
import ModalDialog from './ModalDialog.js';
/**
 * @private
 */
var DataFilterDialog = /** @class */ (function () {
    function DataFilterDialog(chart) {
        this.dialog = new ModalDialog(chart.container);
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
        return 'Dummy HTML content<br>goes here<hr>';
    };
    return DataFilterDialog;
}());
export default DataFilterDialog;

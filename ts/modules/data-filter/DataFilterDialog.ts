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
class DataFilterDialog {
    private dialog: ModalDialog;

    constructor(chart: Highcharts.Chart) {
        this.dialog = new ModalDialog(chart.renderTo);
    }

    buildContent(options: Highcharts.DataFilterDialogOptions): void {
        this.dialog.setContent(this.getDialogContent(options));
    }

    show(): void {
        this.dialog.show();
    }

    destroy(): void {
        this.dialog.destroy();
    }

    private getDialogContent(options: Highcharts.DataFilterDialogOptions): string {
        return 'Dummy HTML content<br>goes here<hr>';
    }
}

export default DataFilterDialog;

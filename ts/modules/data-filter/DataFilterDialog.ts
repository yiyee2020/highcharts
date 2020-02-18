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
class DataFilterDialog {
    private dialog: PopupDialog;

    constructor(chart: Highcharts.Chart) {
        this.dialog = new PopupDialog(chart.renderTo);
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
        return `
            <p style="font-size:1.4em">Filter data</p>
            <p>Currently showing 50 of 50 points</p>
            <select>
                <option>State name</option>
                <option>Value</option>
                <option>Postal Code</option>
            </select>
            <select>
                <option>Equals</option>
                <option>Contains</option>
                <option>Starts with</option>
            </select>
            <input>
            <button>Reset</button>
            <button>Apply</button>
        `;
    }
}

export default DataFilterDialog;

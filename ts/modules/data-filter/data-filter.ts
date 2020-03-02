/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Add data filtering capabilities to Highcharts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
import _DataFilter from './DataFilter.js';
import DataFilterDialog from './DataFilterDialog.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            dataFilterDialog?: DataFilterDialog;
            /** @require modules/data-filter */
            applyDataFilter(dataFilter: _DataFilter): void;
            /** @require modules/data-filter */
            clearDataFilter(): void;
            /** @require modules/data-filter */
            showDataFilterDialog(): void;
            getNumPoints(): number;
            getNumPointsVisible(): number;
        }
        let DataFilter: typeof _DataFilter;
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

import defaultOptions from './options.js';
import defaultLangOptions from './langOptions.js';
import U from '../../parts/Utilities.js';
const { addEvent, extend, merge } = U;

// Merge default options
merge(
    true,
    H.defaultOptions,
    defaultOptions, {
        lang: defaultLangOptions
    }
);

// Make DataFilter class available on Highcharts scope
H.DataFilter = _DataFilter;


/**
 * Apply a data filter to a chart. Will override current
 * visibility of series and points in the chart.
 *
 * @requires module:modules/data-filter
 *
 * @function Highcharts.Chart#applyDataFilter
 *
 * @param {Highcharts.DataFilter} dataFilter
 *          The data filter to apply to the chart, as an
 *          instance of the DataFilter class.
 */
H.Chart.prototype.applyDataFilter = function (dataFilter: _DataFilter): void {
    this.series.forEach((series): void => {
        // Make all series visible
        series.setVisible(true, false);

        // Set visibility of individual points
        series.points.forEach((point): void => {
            const shouldBeVisible = dataFilter.execute(point);

            if (point.visible !== shouldBeVisible) {
                if ((point as any).setVisible) {
                    (point as any).setVisible(shouldBeVisible, false);
                } else {
                    point.update({
                        visible: shouldBeVisible
                    }, false);
                }
            }
        });
    });

    this.redraw();
};


/**
 * Remove all data filters from chart, make all points visible.
 *
 * @requires module:modules/data-filter
 *
 * @function Highcharts.Chart#clearDataFilter
 */
H.Chart.prototype.clearDataFilter = function (): void {
    const emptyFilter = new H.DataFilter();
    this.applyDataFilter(emptyFilter);
};


/**
 * Show the popup dialog for applying data filters.
 *
 * @requires module:modules/data-filter
 *
 * @function Highcharts.Chart#showDataFilterDialog
 */
H.Chart.prototype.showDataFilterDialog = function (): void {
    const dialogOptions = {
        onClose: (): void => {
            const announcer = this.accessibility?.components.infoRegions.announcer;
            const visiblePoints = this.getNumPointsVisible();
            const totalPoints = this.getNumPoints();
            if (announcer) {
                announcer.announce(
                    `Dialog closed. Currently showing ${visiblePoints} of ${totalPoints} data points.`
                );
            }
        }
    };
    const dialog = this.dataFilterDialog = this.dataFilterDialog || new DataFilterDialog(this, dialogOptions);
    const opts = this.options.dataFilter;

    if (opts) {
        dialog.buildContent(opts);
        dialog.show();
    }
};


/**
 * @private
 */
H.Chart.prototype.getNumPointsVisible = function (): number {
    return this.series.reduce((total: number, series: Highcharts.Series): number => {
        const visiblePointsInSeries = series.points.reduce(
            (seriesTotal: number, point: Highcharts.Point): number =>
                seriesTotal + (point.visible ? 1 : 0)
            , 0);

        return total + visiblePointsInSeries;
    }, 0);
};


/**
 * @private
 */
H.Chart.prototype.getNumPoints = function (): number {
    return this.series.reduce((total: number, series: Highcharts.Series): number =>
        total + series.points.length, 0);
};


// Update options with chart updates
addEvent(H.Chart as any, 'update', function (
    this: Highcharts.Chart,
    e: { options: Highcharts.Options }
): void {
    const newOptions = e.options.dataFilter;
    if (newOptions) {
        merge(true, this.options.dataFilter, newOptions);
    }
});


// Add to export menu
const exportingOptions = Highcharts.getOptions().exporting;
if (exportingOptions) {
    extend(exportingOptions.menuItemDefinitions, {
        filterData: {
            textKey: 'filterDataMenuText',
            onclick: function (): void {
                this.showDataFilterDialog();
            }
        }
    } as Highcharts.Dictionary<Highcharts.ExportingMenuObject>);

    if (exportingOptions.buttons) {
        (exportingOptions.buttons.contextButton.menuItems as any).push(
            'filterData'
        );
    }
}

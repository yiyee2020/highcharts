/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  The DataFilter class.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


/**
 * A DataFilter that can be applied to a chart.
 *
 * @class
 * @name Highcharts.DataFilter
 */
class DataFilter {
    execute(point: Highcharts.Point): boolean {
        return Math.random() > 0.5; // Random filter
    }
}

export default DataFilter;

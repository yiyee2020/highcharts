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
var DataFilter = /** @class */ (function () {
    function DataFilter() {
    }
    DataFilter.prototype.execute = function (point) {
        return Math.random() > 0.5; // Random filter
    };
    return DataFilter;
}());
export default DataFilter;

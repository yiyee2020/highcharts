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
/* eslint-disable no-invalid-this, valid-jsdoc */
import U from '../../parts/Utilities.js';
var defined = U.defined, getNestedProperty = U.getNestedProperty;
/**
 * @private
 */
function makePredicate(execute, argumentType) {
    return { execute: execute, argumentType: argumentType };
}
/**
 * A DataFilter that can be applied to a chart.
 *
 * ```js
 *  var filterJohnPoints = new DataFilter('name', 'contains', 'John');
 *  var filterBigValues = new DataFilter('y', 'greaterThan', 10000000);
 *  var filterPointsWithValue = new DataFilter('y', 'hasValue');
 *```
 *
 * @class
 * @name Highcharts.DataFilter
 *
 * @requires module:modules/data-filter
 *
 * @param {string} [key]
 *  The data point property to filter on. Can be a nested key, using dot
 *  notation. If a key is not provided, the filter always returns `true`.
 * @param {string} [predicate]
 *  The predicate/comparison to run when filtering. The following predicates
 *  are supported: `equals`, `contains`, and `startsWith` compare string values.
 *  `lessThan` and `greaterThan` compare numbers. `hasValue` checks that the
 *  property is not `null` or `undefined`. If a predicate is not provided,
 *  the filter always returns `true`.
 * @param {*} [argument]
 *  The constant to compare the point properties to. Note that the argument
 *  type must match the type expected by the predicate used. The `hasValue`
 *  predicate does not require an argument.
 */
var DataFilter = /** @class */ (function () {
    function DataFilter(key, predicate, argument) {
        this.key = key;
        this.argument = argument;
        if (predicate) {
            this.predicate = DataFilter.predicates[predicate];
            this.verifyArgumentType();
        }
    }
    /**
     * Execute the data filter against a point in the chart to determine if
     * it should be filtered out or not.
     *
     * @function Highcharts.DataFilter#execute
     *
     * @param {Highcharts.Point} point The point to execute the filter on.
     *
     * @return {boolean} Whether or not the point should be hidden.
     */
    DataFilter.prototype.execute = function (point) {
        if (!this.key || !this.predicate) {
            return true;
        }
        return this.predicate.execute(getNestedProperty(this.key, point), this.argument);
    };
    /**
     * @private
     */
    DataFilter.prototype.verifyArgumentType = function () {
        var _a, _b;
        var arg = this.argument;
        var predicateArgType = (_a = this.predicate) === null || _a === void 0 ? void 0 : _a.argumentType;
        if (predicateArgType &&
            ((_b = arg) === null || _b === void 0 ? void 0 : _b.constructor) !== predicateArgType) {
            // Is it worth creating a proper Highcharts error # for this?
            throw new Error('Highcharts: DataFilter argument not matching predicate type.');
        }
    };
    DataFilter.predicates = {
        equals: makePredicate(function (a, b) {
            return '' + a === b;
        }, String),
        contains: makePredicate(function (a, b) {
            return ('' + a).indexOf(b) > -1;
        }, String),
        startsWith: makePredicate(function (a, b) {
            return ('' + a).indexOf(b) === 0;
        }, String),
        lessThan: makePredicate(function (a, b) {
            return a < b;
        }, Number),
        greaterThan: makePredicate(function (a, b) {
            return a > b;
        }, Number),
        hasValue: makePredicate(function (a) { return defined(a); })
    };
    return DataFilter;
}());
export default DataFilter;

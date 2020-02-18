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
var getNestedProperty = U.getNestedProperty;
/**
 * @private
 */
function makePredicate(execute, argumentType) {
    return { execute: execute, argumentType: argumentType };
}
/**
 * A DataFilter that can be applied to a chart.
 *
 * @class
 * @name Highcharts.DataFilter
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
    DataFilter.prototype.execute = function (point) {
        if (!this.key || !this.predicate) {
            return true;
        }
        return this.predicate.execute(getNestedProperty(this.key, point), this.argument);
    };
    DataFilter.prototype.verifyArgumentType = function () {
        var _a, _b;
        var arg = this.argument;
        var predicateArgType = (_a = this.predicate) === null || _a === void 0 ? void 0 : _a.argumentType;
        if (predicateArgType &&
            ((_b = arg) === null || _b === void 0 ? void 0 : _b.constructor) !== predicateArgType) {
            throw new Error('Highcharts: DataFilter argument not matching predicate type.');
        }
    };
    DataFilter.predicates = {
        equals: makePredicate(function (a, b) { return a === b; }, String)
    };
    return DataFilter;
}());
export default DataFilter;

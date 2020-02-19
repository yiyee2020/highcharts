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
const { defined, getNestedProperty } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface DataFilterPredicate {
            name: string;
            execute: Function;
            argumentType: unknown;
        }
        type DataFilterPredicateArgumentTypeDescription = 'string'|'number'|'';
        type DataFilterPredicateFunction = keyof typeof DataFilter.predicates;
    }
}


/**
 * @private
 */
function makePredicate(
    name: string,
    execute: Function,
    argumentType?: unknown
): Highcharts.DataFilterPredicate {
    return { name, execute, argumentType };
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
class DataFilter {
    private predicate?: Highcharts.DataFilterPredicate;
    static predicates = {
        equals: makePredicate('Equals', (a: string, b: string): boolean =>
            '' + a === b, String),
        contains: makePredicate('Contains', (a: string, b: string): boolean =>
            ('' + a).indexOf(b) > -1, String),
        startsWith: makePredicate('Starts with', (a: string, b: string): boolean =>
            ('' + a).indexOf(b) === 0, String),
        lessThan: makePredicate('Less than', (a: number, b: number): boolean =>
            a < b, Number),
        greaterThan: makePredicate('Greater than', (a: number, b: number): boolean =>
            a > b, Number),
        hasValue: makePredicate('Has value', (a: unknown): boolean => defined(a))
    };


    constructor(
        private key?: string,
        predicate?: Highcharts.DataFilterPredicateFunction,
        private argument?: unknown
    ) {
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
    execute(point: any): boolean {
        if (!this.key || !this.predicate) {
            return true;
        }

        return this.predicate.execute(
            getNestedProperty(this.key, point), this.argument
        );
    }


    /**
     * Get the human readable name of a predicate function.
     *
     * @function Highcharts.DataFilter#getPredicateName
     *
     * @param {string} predicate The predicate to get the name of, e.g. `lessThan`.
     *
     * @return {string} The human readable name of the predicate.
     */
    static getPredicateName(predicate: Highcharts.DataFilterPredicateFunction): string {
        return DataFilter.predicates[predicate].name;
    }


    /**
     * Get the the predicate argument type of a predicate function.
     *
     * @function Highcharts.DataFilter#getPredicateArgumentType
     *
     * @param {string} predicate The predicate to get the argument of, e.g. `lessThan`.
     *
     * @return {"string"|"number"|""} The type of the predicate argument.
     */
    static getPredicateArgumentType(
        predicate: Highcharts.DataFilterPredicateFunction
    ): Highcharts.DataFilterPredicateArgumentTypeDescription {
        const arg = DataFilter.predicates[predicate].argumentType;

        if (arg === String) {
            return 'string';
        }

        if (arg === Number) {
            return 'number';
        }

        return '';
    }


    /**
     * @private
     */
    private verifyArgumentType(): void {
        const arg = this.argument;
        const predicateArgType = this.predicate?.argumentType;

        if (
            predicateArgType &&
            (arg as any)?.constructor !== predicateArgType
        ) {
            // Is it worth creating a proper Highcharts error # for this?
            throw new Error(
                'Highcharts: DataFilter argument not matching predicate type.'
            );
        }
    }
}

export default DataFilter;

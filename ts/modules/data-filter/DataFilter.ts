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


interface Predicate {
    execute: Function;
    argumentType: unknown;
}


/**
 * @private
 */
function makePredicate(execute: Function, argumentType?: unknown): Predicate {
    return { execute, argumentType };
}


/**
 * A DataFilter that can be applied to a chart.
 *
 * @class
 * @name Highcharts.DataFilter
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
 *
 *```js
 *  var filterJohnPoints = new DataFilter('name', 'contains', 'John');
 *  var filterBigValues = new DataFilter('y', 'greaterThan', 10000000);
 *  var filterPointsWithValue = new DataFilter('y', 'hasValue');
 *```
 */
class DataFilter {
    private static predicates = {
        equals: makePredicate((a: string, b: string): boolean =>
            '' + a === b, String),
        contains: makePredicate((a: string, b: string): boolean =>
            ('' + a).indexOf(b) > -1, String),
        startsWith: makePredicate((a: string, b: string): boolean =>
            ('' + a).indexOf(b) === 0, String),
        lessThan: makePredicate((a: number, b: number): boolean =>
            a < b, Number),
        greaterThan: makePredicate((a: number, b: number): boolean =>
            a > b, Number),
        hasValue: makePredicate((a: unknown): boolean => defined(a))
    };
    private predicate?: Predicate;


    constructor(
        private key?: string,
        predicate?: keyof typeof DataFilter.predicates,
        private argument?: unknown
    ) {
        if (predicate) {
            this.predicate = DataFilter.predicates[predicate];
            this.verifyArgumentType();
        }
    }


    execute(point: any): boolean {
        if (!this.key || !this.predicate) {
            return true;
        }

        return this.predicate.execute(
            getNestedProperty(this.key, point), this.argument
        );
    }


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

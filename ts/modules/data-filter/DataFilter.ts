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
const { getNestedProperty } = U;


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
        exists: makePredicate((a: unknown): boolean => !!a)
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
            throw new Error(
                'Highcharts: DataFilter argument not matching predicate type.'
            );
        }
    }
}

export default DataFilter;

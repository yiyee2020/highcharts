/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  DataFilter dialog options. Merged with default chart options.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface DataFilterDialogOptions {
            keys: Dictionary<string>|null;
            predicates: Array<DataFilterPredicateFunction>;
            showTotalPoints: boolean;
            caseSensitive: boolean;
        }
        interface Options {
            /** @require modules/data-filter */
            dataFilter?: DataFilterDialogOptions;
        }
    }
}

const options = {
    dataFilter: {
        keys: null,
        predicates: ['contains', 'equals', 'startsWith', 'lessThan', 'greaterThan', 'hasValue'],
        showTotalPoints: true,
        caseSensitive: false
    }
};

export default options;

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

import H from '../../parts/Globals.js';
const doc = H.doc;

import PopupDialog from './PopupDialog.js';
import DataFilter from './DataFilter.js';


/**
 * @private
 */
class DataFilterDialog {
    private dialog: PopupDialog;
    private contentContainer?: HTMLElement;
    private totalPointsElement?: HTMLElement;
    private filterKeyElement?: HTMLSelectElement;
    private predicateElement?: HTMLSelectElement;
    private argumentContainer?: HTMLElement;
    private argumentElement?: HTMLInputElement;
    private currentFilterKey?: string;
    private currentPredicate?: Highcharts.DataFilterPredicateFunction;
    private currentArgumentValue?: string;
    private currentArgumentType?: string;
    private caseSensitive?: boolean;

    constructor(private chart: Highcharts.Chart) {
        this.dialog = new PopupDialog(chart.renderTo);
    }

    buildContent(options: Highcharts.DataFilterDialogOptions): void {
        this.caseSensitive = options.caseSensitive;
        this.dialog.setContent(this.getDialogContent(options));
    }

    show(): void {
        this.updateTotalPoints();
        this.dialog.show();
    }

    destroy(): void {
        this.dialog.destroy();
    }

    private getDialogContent(options: Highcharts.DataFilterDialogOptions): HTMLElement {
        if (this.contentContainer) {
            this.contentContainer.remove();
            delete this.contentContainer;
            delete this.totalPointsElement;
            delete this.filterKeyElement;
            delete this.predicateElement;
            delete this.argumentContainer;
            delete this.argumentElement;
        }
        const contentContainer = this.contentContainer = doc.createElement('div');

        contentContainer.appendChild(this.makeHeadingElement());

        if (options.showTotalPoints) {
            this.totalPointsElement = this.totalPointsElement || this.makeTotalPointsElement();
            this.updateTotalPoints();
            contentContainer.appendChild(this.totalPointsElement);
        }

        this.argumentContainer = this.makeArgumentContainer();

        const keys = this.getFilterKeys(options.keys);
        this.filterKeyElement = this.makeFilterKeyElement(keys);
        contentContainer.appendChild(this.filterKeyElement);

        this.predicateElement = this.makePredicateElement(options.predicates);
        contentContainer.appendChild(this.predicateElement);

        contentContainer.appendChild(this.argumentContainer);
        contentContainer.appendChild(this.makeResetButtonElement());
        contentContainer.appendChild(this.makeApplyButtonElement());

        return contentContainer;
    }


    private makeHeadingElement(): HTMLElement {
        const heading = doc.createElement('p');
        heading.style.cssText = 'font-size: 1.4em; color: #444; margin-top: 5px';
        heading.textContent = 'Filter data';
        return heading;
    }


    private makeTotalPointsElement(): HTMLElement {
        const total = doc.createElement('p');
        total.style.cssText = 'font-size: 1em; color: #444;';
        total.setAttribute('aria-live', 'polite');
        return total;
    }


    private updateTotalPoints(): void {
        if (!this.totalPointsElement) {
            return;
        }

        let totalPoints = 0;
        let visiblePoints = 0;
        this.chart.series.forEach((series: Highcharts.Series): void => {
            series.points.forEach((point: Highcharts.Point): void => {
                if (point.visible) {
                    visiblePoints++;
                }
                totalPoints++;
            });
        });

        this.totalPointsElement.innerHTML =
            `Currently showing ${visiblePoints} of ${totalPoints} data points.`;
    }


    private getFilterKeys(keys: Highcharts.Dictionary<string>|null): Highcharts.Dictionary<string> {
        if (keys) {
            return keys;
        }

        const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

        return this.chart.series.reduce(
            (chartKeys: Highcharts.Dictionary<string>, series: Highcharts.Series): Highcharts.Dictionary<string> => {
                (series.pointArrayMap || []).forEach((seriesKey: string): void => {
                    chartKeys[seriesKey] = capitalize(seriesKey);
                });
                return chartKeys;
            }, {});
    }


    private makeFilterKeyElement(keys: Highcharts.Dictionary<string>): HTMLSelectElement {
        const curFilterKey = this.currentFilterKey = this.currentFilterKey || Object.keys(keys)[0];
        const select = doc.createElement('select');
        select.style.cssText = 'margin: 10px; font-size: 0.8em; color: #333';
        select.setAttribute('aria-label', 'Filter by');

        Object.keys(keys).forEach((pointKey: string): void => {
            const option = doc.createElement('option');
            option.innerHTML = keys[pointKey];
            option.value = pointKey;
            option.selected = curFilterKey === pointKey;
            select.appendChild(option);
        });

        select.onchange = (e: Event): void => {
            this.currentFilterKey = (e.target as HTMLOptionElement).value;
        };

        return select;
    }


    private makePredicateElement(predicates: Highcharts.DataFilterPredicateFunction[]): HTMLSelectElement {
        const curPredicate = this.currentPredicate = this.currentPredicate || predicates[0];
        const select = doc.createElement('select');
        select.style.cssText = 'margin: 10px; font-size: 0.8em; color: #333';
        select.setAttribute('aria-label', 'Filter type');

        predicates.forEach((predicate: Highcharts.DataFilterPredicateFunction): void => {
            const option = doc.createElement('option');
            option.innerHTML = DataFilter.getPredicateName(predicate);
            option.selected = predicate === curPredicate;
            option.value = predicate;
            select.appendChild(option);
        });

        this.updateArgumentElement();

        select.onchange = (e: Event): void => {
            this.currentPredicate = (e.target as HTMLOptionElement)
                .value as Highcharts.DataFilterPredicateFunction;
            this.updateArgumentElement();
        };

        return select;
    }


    private makeArgumentContainer(): HTMLElement {
        const container = doc.createElement('div');
        container.style.cssText = 'width: 100%';
        return container;
    }


    private makeResetButtonElement(): HTMLElement {
        const btn = doc.createElement('button');
        btn.style.cssText = 'margin: 5px 10px; width: 90px; height: 35px; padding: 0';

        btn.innerHTML = 'Reset';
        btn.onclick = (): void => {
            this.chart.clearDataFilter();
            this.updateTotalPoints();
        };

        return btn;
    }


    private makeApplyButtonElement(): HTMLElement {
        const btn = doc.createElement('button');
        btn.style.cssText = 'margin: 5px 10px; width: 90px; height: 35px; padding: 0';

        btn.innerHTML = 'Apply';
        btn.onclick = (): void => {
            const keySelect = this.filterKeyElement;
            const predicate = this.currentPredicate;

            if (!keySelect || !predicate) {
                return;
            }

            const key = keySelect.options[keySelect.selectedIndex].value;
            const argumentValue = (this.argumentElement || {}).value;
            const argIsNumber = DataFilter.getPredicateArgumentType(predicate) === 'number';
            const argument = argIsNumber && argumentValue ? parseFloat(argumentValue) : argumentValue;

            const filter = new DataFilter(key, predicate as any, argument, {
                caseSensitive: this.caseSensitive
            });
            this.chart.applyDataFilter(filter);
            this.updateTotalPoints();
        };

        return btn;
    }


    private updateArgumentElement(): void {
        let argElement = this.argumentElement;
        const curPredicate = this.currentPredicate;
        const newArgType = curPredicate && DataFilter.getPredicateArgumentType(curPredicate);
        const newInputType = newArgType && this.getInputTypeFromArgumentType(newArgType);

        const shouldUpdateArgument = argElement?.type !== newInputType;
        if (!shouldUpdateArgument) {
            return;
        }

        if (argElement) {
            argElement.remove();
            delete this.argumentElement;
        }

        if (newInputType) {
            argElement = this.argumentElement = doc.createElement('input');
            argElement.style.cssText =
                'display: block; margin: 5px auto; width: 200px; font-size: 0.8em; color: #333; padding: 2px 8px;';
            argElement.type = newInputType;
            argElement.onchange = (e: Event): void => {
                this.currentArgumentValue = (e.target as HTMLInputElement).value;
            };

            // Init the value of the input
            const oldValue = this.currentArgumentValue;
            const oldType = this.currentArgumentType;

            if (newInputType === oldType && typeof oldValue !== 'undefined') {
                argElement.value = oldValue;
            } else if (newInputType === 'number') {
                argElement.value = '0';
            }

            this.currentArgumentType = newInputType;
            this.argumentContainer?.appendChild(argElement);
        }
    }


    private getInputTypeFromArgumentType(
        argType: Highcharts.DataFilterPredicateArgumentTypeDescription
    ): string {
        if (!argType) {
            return '';
        }
        return argType === 'number' ? 'number' : 'text';
    }
}

export default DataFilterDialog;

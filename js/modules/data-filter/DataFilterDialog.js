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
var doc = H.doc;
import PopupDialog from './PopupDialog.js';
import DataFilter from './DataFilter.js';
/**
 * @private
 */
var DataFilterDialog = /** @class */ (function () {
    function DataFilterDialog(chart) {
        this.chart = chart;
        this.dialog = new PopupDialog(chart.renderTo);
    }
    DataFilterDialog.prototype.buildContent = function (options) {
        this.dialog.setContent(this.getDialogContent(options));
    };
    DataFilterDialog.prototype.show = function () {
        this.updateTotalPoints();
        this.dialog.show();
    };
    DataFilterDialog.prototype.destroy = function () {
        this.dialog.destroy();
    };
    DataFilterDialog.prototype.getDialogContent = function (options) {
        if (this.contentContainer) {
            this.contentContainer.remove();
        }
        var contentContainer = this.contentContainer = doc.createElement('div');
        contentContainer.appendChild(this.makeHeadingElement());
        if (options.showTotalPoints) {
            this.totalPointsElement = this.totalPointsElement || this.makeTotalPointsElement();
            this.updateTotalPoints();
            contentContainer.appendChild(this.totalPointsElement);
        }
        this.argumentContainer = this.makeArgumentContainer();
        var keys = this.getFilterKeys(options.keys);
        this.filterKeyElement = this.makeFilterKeyElement(keys);
        contentContainer.appendChild(this.filterKeyElement);
        this.predicateElement = this.makePredicateElement(options.predicates);
        contentContainer.appendChild(this.predicateElement);
        contentContainer.appendChild(this.argumentContainer);
        contentContainer.appendChild(this.makeResetButtonElement());
        contentContainer.appendChild(this.makeApplyButtonElement());
        return contentContainer;
    };
    DataFilterDialog.prototype.makeHeadingElement = function () {
        var heading = doc.createElement('p');
        heading.style.cssText = 'font-size: 1.4em; color: #444';
        return heading;
    };
    DataFilterDialog.prototype.makeTotalPointsElement = function () {
        var total = doc.createElement('p');
        total.setAttribute('aria-live', 'polite');
        return total;
    };
    DataFilterDialog.prototype.updateTotalPoints = function () {
        if (!this.totalPointsElement) {
            return;
        }
        var totalPoints = 0;
        var visiblePoints = 0;
        this.chart.series.forEach(function (series) {
            series.points.forEach(function (point) {
                if (point.visible) {
                    visiblePoints++;
                }
                totalPoints++;
            });
        });
        this.totalPointsElement.innerHTML =
            "Currently showing " + visiblePoints + " of " + totalPoints + " data points.";
    };
    DataFilterDialog.prototype.getFilterKeys = function (keys) {
        if (keys) {
            return keys;
        }
        var capitalize = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
        return this.chart.series.reduce(function (chartKeys, series) {
            (series.pointArrayMap || []).forEach(function (seriesKey) {
                chartKeys[seriesKey] = capitalize(seriesKey);
            });
            return chartKeys;
        }, {});
    };
    DataFilterDialog.prototype.makeFilterKeyElement = function (keys) {
        var select = doc.createElement('select');
        select.setAttribute('aria-label', 'Filter by');
        Object.keys(keys).forEach(function (pointKey) {
            var option = doc.createElement('option');
            option.innerHTML = keys[pointKey];
            option.value = pointKey;
            select.appendChild(option);
        });
        return select;
    };
    DataFilterDialog.prototype.makePredicateElement = function (predicates) {
        var _this = this;
        var select = doc.createElement('select');
        select.setAttribute('aria-label', 'Filter type');
        predicates.forEach(function (predicate) {
            var option = doc.createElement('option');
            option.innerHTML = DataFilter.getPredicateName(predicate);
            option.value = predicate;
            select.appendChild(option);
        });
        this.currentPredicate = predicates[0];
        this.updateArgumentElement();
        select.onchange = function (e) {
            _this.currentPredicate = e.target
                .value;
            _this.updateArgumentElement();
        };
        return select;
    };
    DataFilterDialog.prototype.makeArgumentContainer = function () {
        var container = doc.createElement('div');
        return container;
    };
    DataFilterDialog.prototype.makeResetButtonElement = function () {
        var _this = this;
        var btn = doc.createElement('button');
        btn.innerHTML = 'Reset';
        btn.onclick = function () {
            _this.chart.clearDataFilter();
            _this.updateTotalPoints();
        };
        return btn;
    };
    DataFilterDialog.prototype.makeApplyButtonElement = function () {
        var _this = this;
        var btn = doc.createElement('button');
        btn.innerHTML = 'Apply';
        btn.onclick = function () {
            var keySelect = _this.filterKeyElement;
            var predicate = _this.currentPredicate;
            if (!keySelect || !predicate) {
                return;
            }
            var key = keySelect.options[keySelect.selectedIndex].value;
            var argumentValue = (_this.argumentElement || {}).value;
            var argIsNumber = DataFilter.getPredicateArgumentType(predicate) === 'number';
            var argument = argIsNumber && argumentValue ? parseFloat(argumentValue) : argumentValue;
            var filter = new DataFilter(key, predicate, argument);
            _this.chart.applyDataFilter(filter);
            _this.updateTotalPoints();
        };
        return btn;
    };
    DataFilterDialog.prototype.updateArgumentElement = function () {
        var _a, _b;
        var argElement = this.argumentElement;
        var curPredicate = this.currentPredicate;
        var curArgType = curPredicate && DataFilter.getPredicateArgumentType(curPredicate);
        var newInputType = curArgType && this.getInputTypeFromArgumentType(curArgType);
        var shouldUpdateArgument = ((_a = argElement) === null || _a === void 0 ? void 0 : _a.type) !== newInputType;
        if (!shouldUpdateArgument) {
            return;
        }
        if (argElement) {
            argElement.remove();
            delete this.argumentElement;
        }
        if (newInputType) {
            argElement = this.argumentElement = doc.createElement('input');
            argElement.type = newInputType;
            if (newInputType === 'number') {
                argElement.value = '0';
            }
            (_b = this.argumentContainer) === null || _b === void 0 ? void 0 : _b.appendChild(argElement);
        }
    };
    DataFilterDialog.prototype.getInputTypeFromArgumentType = function (argType) {
        if (!argType) {
            return '';
        }
        return argType === 'number' ? 'number' : 'text';
    };
    return DataFilterDialog;
}());
export default DataFilterDialog;

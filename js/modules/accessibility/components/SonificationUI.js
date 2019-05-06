/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Automatic sonification UI.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

// TODO:
// Consider if this should just be part of the InfoRegionComponent.
// i18n
// !!!!!!!!!!!!!!!!!!!


/**
 * Create the automatic sonification UI for a chart.
 * @private
 *
 * @param {Highcharts.AccessibilityComponent} component
 *      The accessibility component to connect the UI to.
 * @return {Highcharts.HTMLDOMElement} A container element with the UI for
 *      screen reader users.
 */
function createSonificationScreenReaderUI(component) {
    var container = component.createElement('div'),
        heading = component.createElement('h6'),
        help = component.createElement('button');

    heading.innerHTML = 'Test sonification';
    help.innerHTML = 'Help';
    help.setAttribute('aria-pressed', false);

    container.appendChild(heading);
    container.appendChild(help);

    // Add buttons for the individual series of the chart
    var series = component.chart.series;
    if (series && series.length) {
        series.forEach(function (s) {
            // Add a "Play" and an "Explore" button for each series.
            
        });
    }

    return container;
}

export default createSonificationScreenReaderUI;

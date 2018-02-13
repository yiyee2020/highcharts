'use strict';

import H from '../parts/Globals.js';
import '../parts/Color.js';
import '../parts/Utilities.js';

var each = H.each,
	merge = H.merge,
	isArray = H.isArray,
	SMA = H.seriesTypes.sma,
	pick = H.pick,
	color = H.color;

// Utils:
function getStandardDeviation(arr, index, isOHLC, mean) {
	var variance = 0,
		arrLen = arr.length,
		std = 0,
		i = 0,
		value;

	for (; i < arrLen; i++) {
		value = (isOHLC ? arr[i][index] : arr[i]) - mean;
		variance += value * value;
	}
	variance = variance / (arrLen - 1);

	std = Math.sqrt(variance);
	return std;
}

H.seriesType('bb', 'sma',
	/**
	 * Bollinger bands (BB). This series requires the `linkedTo` option to be
	 * set and should be loaded after the `stock/indicators/indicators.js` file.
	 *
	 * @extends {plotOptions.sma}
	 * @product highstock
	 * @sample {highstock} stock/indicators/bollinger-bands
	 *                     Bollinger bands
	 * @since 6.0.0
	 * @optionparent plotOptions.bb
	 */
	{
		name: 'BB (20, 2)',
		params: {
			period: 20,
			/**
			 * Standard deviation for top and bottom bands.
			 *
			 * @type {Number}
			 * @since 6.0.0
			 * @product highstock
			 */
			standardDeviation: 2,
			index: 3
		},
		/**
		 * Bottom line options.
		 *
		 * @since 6.0.0
		 * @product highstock
		 */
		bottomLine: {
			/**
			 * Styles for a bottom line.
			 *
			 * @since 6.0.0
			 * @product highstock
			 */
			styles: {
				/**
				 * Pixel width of the line.
				 *
				 * @type {Number}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineWidth: 1,
				/**
				 * Color of the line. If not set, it's inherited from
				 * [plotOptions.bb.color](#plotOptions.bb.color).
				 *
				 * @type {String}
				 * @since 6.0.0
				 * @product highstock
				 */
				lineColor: undefined
			}
		},
		/**
		 * Top line options.
		 *
		 * @extends {plotOptions.bb.bottomLine}
		 * @since 6.0.0
		 * @product highstock
		 */
		topLine: {
			styles: {
				lineWidth: 1,
				lineColor: undefined
			}
		},

		/**
		 * Color of the background.
		 * If not set, it's inherited from
		 * [plotOptions.bb.color](#plotOptions.bb.color).
		 *
		 * @type {String}
		 * @since 6.0.7
		 * @product highstock
		 */
		fillColor: 'none',

		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
		},
		marker: {
			enabled: false
		},
		dataGrouping: {
			approximation: 'averages'
		}
	}, /** @lends Highcharts.Series.prototype */ {
		pointArrayMap: ['top', 'middle', 'bottom'],
		pointValKey: 'middle',
		nameComponents: ['period', 'standardDeviation'],
		init: function () {
			SMA.prototype.init.apply(this, arguments);

			// Set default color for lines:
			this.options = merge({
				topLine: {
					styles: {
						lineColor: this.color
					}
				},
				bottomLine: {
					styles: {
						lineColor: this.color
					}
				}
			}, this.options);
		},
		toYData: function (point) {
			return [point.top, point.middle, point.bottom];
		},
		translate: function () {
			var indicator = this,
				translatedBB = ['plotTop', 'plotMiddle', 'plotBottom'];

			SMA.prototype.translate.apply(indicator, arguments);

			each(indicator.points, function (point) {
				each(
					[point.top, point.middle, point.bottom],
					function (value, i) {
						if (value !== null) {
							point[translatedBB[i]] = indicator.yAxis.toPixels(
								value,
								true
							);
						}
					}
				);
			});
		},

		getGraphPath: function () {
			var graphName = this.drawing;

			return {
				topLine: this.upperPath,
				bottomLine: this.lowerPath,
				area: this.areaPath,
				graph: this.graphPath
			}[graphName] || this.graphPath;
		},

		gappedPath: null,

		gappedPoints: function () {
			var indicator = this,
				currentDataGrouping = indicator.currentDataGrouping,
				groupingSize =
					currentDataGrouping && currentDataGrouping.totalRange,
				gapSize = indicator.options.gapSize,
				points = indicator.points.slice(),
				i = points.length - 1,
				xRange;

			if (gapSize && i > 0) { // #5008

				// Gap unit is relative
				if (indicator.options.gapUnit !== 'value') {
					gapSize *= indicator.closestPointRange;
				}

				// Setting a new gapSize in case dataGrouping is enabled (#7686)
				if (groupingSize && groupingSize > gapSize) {
					gapSize = groupingSize;
				}

				// extension for ordinal breaks
				while (i--) {
					if (points[i + 1].x - points[i].x > gapSize) {
						xRange = (points[i].x + points[i + 1].x) / 2;

						points.splice( // insert after this one
							i + 1,
							0, {
								isNull: true,
								x: xRange
							}
						);
					}
				}
			}

			return points;
		},

		generateGraphs: function () {
			var indicator = this,
				getGraphPath = SMA.prototype.getGraphPath,
				connectNulls = this.options.connectNulls,
				lowerPoints = [],
				upperPoints = [],
				upperAreaPoints = [],
				upperPoint,
				lowerPoint,
				point,
				i,
				points;

			points = indicator.gappedPoints();
			i = points.length;

			while (i--) {
				point = points[i];

				upperPoint = {
					x: point.x,
					plotX: point.plotX,
					plotY: point.plotTop,
					isNull: point.isNull
				};

				upperPoints.push(upperPoint);

				lowerPoint = {
					x: point.x,
					plotX: point.plotX,
					plotY: point.plotBottom,
					isNull: point.isNull
				};

				lowerPoints.unshift(lowerPoint);

				if (!point.isNull &&
					!connectNulls &&
					(!points[i + 1] || points[i + 1].isNull)
				) {
					upperAreaPoints.push(lowerPoint);
				}

				upperAreaPoints.push(upperPoint);


				if (!point.isNull &&
					!connectNulls &&
					(!points[i - 1] || points[i - 1].isNull)
				) {
					upperAreaPoints.push(lowerPoint);
				}
			}

			indicator.lowerPath = getGraphPath.call(indicator, lowerPoints);

			indicator.upperPath = getGraphPath.call(indicator, upperPoints);
			indicator.upperAreaPath = getGraphPath.call(
				indicator,
				upperAreaPoints
			);

			if (indicator.upperAreaPath[0] === 'M') {
				indicator.upperAreaPath[0] = 'L';
			}

			indicator.areaPath = indicator.lowerPath.concat(
				indicator.upperAreaPath
			);
			indicator.areaPath.isArea = true;
			indicator.areaPath.xMap = indicator.lowerPath.xMap;

			indicator.graphPath = getGraphPath.call(indicator, points);
		},

		drawAreaGraph: function () {
			var series = this,
				areaPath = this.areaPath,
				options = this.options,
				zones = this.zones,
				props = [
					[
						'area',
						'highcharts-area',

						this.color,
						options.fillColor

					]
				];

			each(zones, function (zone, i) {
				props.push([
					'zone-area-' + i,
					'highcharts-area highcharts-zone-area-' + i + ' ' +
			zone.className,

					zone.color || series.color,
					zone.fillColor || options.fillColor

				]);
			});

			each(props, function (prop) {
				var areaKey = prop[0],
					area = series[areaKey];

				// Create or update the area
				if (area) { // update
					area.endX = series.preventGraphAnimation ?
						null : 
						areaPath.xMap;

					area.animate({
						d: areaPath
					});

				} else { // create
					area = series[areaKey] = series.chart.renderer
					.path(areaPath)
					.addClass(prop[1])
					.attr({
						fill: pick(
							prop[3],
							color(prop[2])
								.setOpacity(pick(options.fillOpacity, 0.75))
								.get()
						),

						zIndex: 0 // #1069
					}).add(series.group);
					area.isArea = true;
				}
				area.startX = areaPath.xMap;
				area.shiftUnit = options.step ? 2 : 1;
			});
		},

		drawGraph: function () {
			var indicator = this,
				points = this.points,
				options = this.options,
				graph;

			indicator.generateGraphs();

			graph = indicator.graph;

			// Modify options and generate lines:
			each(['topLine', 'bottomLine'], function (graphName) {
				var key = 'graph' + graphName;

				indicator.drawing = graphName;

				indicator.options = merge(
					options[graphName].styles,
					{ gapSize: options.gapSize }
				);
				indicator.graph = indicator[key];

				SMA.prototype.drawGraph.call(indicator);

				indicator[key] = indicator.graph;
			});

			// Now save lines:

			indicator.points = points;
			indicator.options = options;
			indicator.graph = graph;
			indicator.drawing = null;

			SMA.prototype.drawGraph.call(this);

			indicator.drawAreaGraph();
		},

		getValues: function (series, params) {
			var period = params.period,
				standardDeviation = params.standardDeviation,
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				BB = [], // 0- date, 1-middle line, 2-top line, 3-bottom line
				ML, TL, BL, // middle line, top line and bottom line
				date,
				xData = [],
				yData = [],
				slicedX,
				slicedY,
				stdDev,
				isOHLC,
				point,
				i;

			if (xVal.length < period) {
				return false;
			}

			isOHLC = isArray(yVal[0]);

			for (i = period; i <= yValLen; i++) {
				slicedX = xVal.slice(i - period, i);
				slicedY = yVal.slice(i - period, i);

				point = SMA.prototype.getValues.call(
					this,
					{
						xData: slicedX,
						yData: slicedY
					},
					params
					);

				date = point.xData[0];
				ML = point.yData[0];
				stdDev = getStandardDeviation(
					slicedY,
					params.index,
					isOHLC,
					ML
					);
				TL = ML + standardDeviation * stdDev;
				BL = ML - standardDeviation * stdDev;

				BB.push([date, TL, ML, BL]);
				xData.push(date);
				yData.push([TL, ML, BL]);
			}

			return {
				values: BB,
				xData: xData,
				yData: yData
			};
		}
	}
);

/**
 * A bollinger bands indicator. If the [type](#series.bb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bb](#plotOptions.bb).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.bb
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.bb
 */

/**
 * An array of data points for the series. For the `bb` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.bb.data
 */

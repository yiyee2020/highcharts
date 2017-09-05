/**
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Series.js';
var Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	each = H.each,
	isNumber = H.isNumber;

var getTooltipPos = function (options) {
	var x = options.x,
		y = options.y,
		xAxis = options.xAxis,
		yAxis = options.yAxis,
		translateX = function (val) {
			return xAxis.translate(val, 0, 0, 0, 0);
		},
		translateY = function (val) {
			return yAxis.translate(val, 0, 1, 0, 0);
		};
	return [translateX(x), translateY(y)];
};

var getShapeArgs = function getShapeArgs(options) {
	var x = options.x,
		y = options.y,
		xAxis = options.xAxis,
		yAxis = options.yAxis,
		translateX = function (val) {
			return xAxis.translate(val, 0, 0, 0, 0);
		},
		translateY = function (val) {
			return yAxis.translate(val, 0, 1, 0, 0);
		},
		center = options.center,
		vertical = (
			y === 0 ?
			'bottom' : (
				(y === (yAxis.max)) ?
				'top' :
				'middle'
			)
		),
		horizontal = (
			x === 0 ?
			'left' : (
				(x === (xAxis.max)) ?
				'right' :
				'middle'
			)
		),
		lines = [];
	var adjust = 0.5;
	if (vertical === 'bottom' && horizontal === 'left') {
		lines = [
			[x, y + 1],
			[x, y],
			[x + 1, y]
		];
	} else if (vertical === 'bottom' && horizontal === 'right') {
		lines = [
			[x, y],
			[x + 1, y],
			[x + 1, y + 1]
		];
	} else if (vertical === 'top' && horizontal === 'left') {
		lines = [
			[x + 1, y + 1],
			[x, y + 1],
			[x, y]
		];
	} else if (vertical === 'top' && horizontal === 'right') {
		lines = [
			[x, y + 1],
			[x + 1, y + 1],
			[x + 1, y]
		];
	} else if (vertical === 'bottom' && horizontal === 'middle') {
		lines = [
			[x, y],
			[x + 1, y]
		];
	} else if (vertical === 'top' && horizontal === 'middle') {
		lines = [
			[x, y + 1],
			[x + 1, y + 1]
		];
	} else if (vertical === 'middle' && horizontal === 'left') {
		lines = [
			[x, y],
			[x, y + 1]
		];
	} else if (vertical === 'middle' && horizontal === 'right') {
		lines = [
			[x + 1, y],
			[x + 1, y + 1]
		];
	} else {
		return {
			d: ''
		};
	}
	var arr = lines.reduce(function (result, line) {
		return result.concat(['L', translateX(line[0] - adjust), translateY(line[1] - adjust)]);
	}, []);
	var path = [].concat(
		['M'], center,
		arr,
		['L'], center
	);
	return {
		d: path.join(' ')
	};
};

var squarePieOptions = {
	clip: false,
	dataLabels: {
		enabled: true,
		format: '{point.name}'
	}
};

var squarePieSeries = {
	drawPoints: function drawPoints() {
		var series = this,
			group = series.group,
			points = series.points,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			chart = series.chart,
			center = [
				chart.plotWidth / 2,
				chart.plotHeight / 2
			],
			renderer = series.chart.renderer;
		each(points, function (point) {
			point.shapeArgs = getShapeArgs({
				center: center,
				x: point.x,
				y: point.y,
				xAxis: xAxis,
				yAxis: yAxis
			});
			point.draw({
				attr: series.pointAttribs(point, point.selected && 'select'),
				group: group,
				renderer: renderer,
				shapeType: 'path',
				shapeArgs: point.shapeArgs
			});
		});
	},
	pointAttribs: seriesTypes.column.prototype.pointAttribs,
	translate: function () {
		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis;
		Series.prototype.translate.call(series);
		each(series.points, function (point) {
			point.tooltipPos = getTooltipPos({
				xAxis: xAxis,
				yAxis: yAxis,
				x: point.x,
				y: point.y
			});
			point.plotX = point.tooltipPos[0];
			point.plotY = point.tooltipPos[1];
		});
	}
};

var squarePiePoint = {
	draw: function draw(options) {
		var point = this,
			graphic = point.graphic,
			group = options.group,
			renderer = options.renderer,
			shape = options.shapeArgs,
			type = options.shapeType,
			attr = options.attr;
		if (point.shouldDraw()) {
			if (!graphic) {
				point.graphic = graphic = renderer[type](shape).add(group);
			}
			graphic.attr(attr).animate(shape);
		} else {
			point.graphic = point.destroy();
		}
	},
	shouldDraw: function shouldDraw() {
		var point = this;
		return (
			isNumber(point.x) &&
			isNumber(point.y) &&
			point.shapeArgs.d !== ''
		);
	}
};

seriesType(
    'squarepie',
    'line',
    squarePieOptions,
    squarePieSeries,
    squarePiePoint
);

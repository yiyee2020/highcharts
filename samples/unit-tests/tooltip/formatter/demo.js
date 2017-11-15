QUnit.test('Formatter returns undefined', function (assert) {
    var chart = Highcharts.chart('container', {
        tooltip: {
            formatter: function () {
                return undefined;
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    // Test wether tooltip.refresh raises an exception.
    assert.ok(
        true,
        'Tooltip.refresh passes when formatter returns undefined. #5922'
    );
});

QUnit.test('Return false from tooltip.formatter (#5915)', function (assert) {
    var chart = Highcharts.chart('container', {
            tooltip: {
                formatter: function () {
                    return this.y > 2 ? "Display" : false;
                }
            },
            series: [{
                data: [1, 3]
            }]
        }),
        p1 = chart.series[0].points[0],
        p2 = chart.series[0].points[1],
        tooltip = chart.tooltip;

    tooltip.refresh(p1);
    assert.strictEqual(
        document.querySelector('.highcharts-tooltip'),
        null,
        'No tooltip yet'
    );

    tooltip.refresh(p2);
    assert.strictEqual(
        document.querySelector('.highcharts-tooltip').nodeName,
        'g',
        'Tooltip added'
    );

});

QUnit.test('Default tooltip format', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'scatter',
            data: [[201000015.53, 100000000.87]]
        }]
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    assert.strictEqual(
        chart.tooltip.label.text.textStr.split('<b>')[1].split('<')[0],
        '201 000 015.53',
        'x formatted using thousands lang option (#7401)'
    );
});

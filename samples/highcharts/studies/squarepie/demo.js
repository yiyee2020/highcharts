(function (H) {
    var points = [
        'Apathy',
        'Boredom',
        'Relaxation',
        'Worry',
        null,
        'Control',
        'Anxiety',
        'Arousal',
        'Flow'
    ];
    var colors = [
        '#62DBD4',
        '#81E6D4',
        '#51CA6D',
        '#B6C1D3',
        null,
        '#CDFF00',
        '#FE8084',
        '#FFCC3B',
        '#FFFF01'
    ];
    var labelStyle = {
        color: '#000000',
        fontSize: '15px',
        fontWeight: 'bolder'
    };
    var d = points.reduce(function (data, name, i) {
        if (name) {
            data.push({
                x: i % 3,
                y: Math.floor(i / 3),
                color: colors[i],
                name: name
            });
        }
        return data;
    }, []);
    H.chart('container', {
        chart: {
            width: 600,
            height: 600
        },
        legend: {
            enabled: false
        },
        series: [{
            colorByPoint: true,
            borderWidth: 2,
            borderColor: '#000000',
            type: 'squarepie',
            data: d
        }],
        subtitle: {
            text: 'Source <a href="">Zapier</a>',
            useHTML: true
        },
        title: {
            text: 'Finding Flow'
        },
		tooltip: {
			enabled: false
		},
        xAxis: {
            categories: ['Low', 'Skill Level', 'High'],
            tickWidth: 0,
            labels: {
                style: labelStyle
            }
        },
        yAxis: {
            categories: ['Low', 'Challenge Level', 'High'],
            labels: {
                rotation: -90,
                style: labelStyle
            },
            title: null
        }
    });
}(Highcharts));
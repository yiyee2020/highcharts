var data = [
    ['California', 39937489],
    ['Texas', 29472295],
    ['Florida', 21992985],
    ['New York', 19440469],
    ['Pennsylvania', 12820878],
    ['Illinois', 12659682],
    ['Ohio', 11747694],
    ['Georgia', 10736059],
    ['North Carolina', 10611862],
    ['Michigan', 10045029],
    ['New Jersey', 8936574],
    ['Virginia', 8626207],
    ['Washington', 7797095],
    ['Arizona', 7378494],
    ['Massachusetts', 6976597],
    ['Tennessee', 6897576],
    ['Indiana', 6745354],
    ['Missouri', 6169270],
    ['Maryland', 6083116],
    ['Wisconsin', 5851754],
    ['Colorado', 5845526],
    ['Minnesota', 5700671],
    ['South Carolina', 5210095],
    ['Alabama', 4908621],
    ['Louisiana', 4645184],
    ['Kentucky', 4499692],
    ['Oregon', 4301089],
    ['Oklahoma', 3954821],
    ['Connecticut', 3563077],
    ['Utah', 3282115],
    ['Iowa', 3179849],
    ['Nevada', 3139658],
    ['Arkansas', 3038999],
    ['Mississippi', 2989260],
    ['Kansas', 2910357],
    ['New Mexico', 2096640],
    ['Nebraska', 1952570],
    ['Idaho', 1826156],
    ['West Virginia', 1778070],
    ['Hawaii', 1412687],
    ['New Hampshire', 1371246],
    ['Maine', 1345790],
    ['Montana', 1086759],
    ['Rhode Island', 1056161],
    ['Delaware', 982895],
    ['South Dakota', 903027],
    ['North Dakota', 761723],
    ['Alaska', 734002],
    ['Vermont', 628061],
    ['Wyoming', 567025]
];


var chart = Highcharts.mapChart('container', {
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {xDescription}, {value}.'
        }
    },

    dataFilter: {
        keys: {
            name: 'State name',
            'properties.postal-code': 'State code',
            value: 'Population number'
        }
    },

    chart: {
        map: 'countries/us/us-all'
    },

    title: {
        text: 'Population per state'
    },

    subtitle: {
        text: 'Source: US Census Bureau 2020 estimates'
    },

    mapNavigation: {
        enabled: true
    },

    legend: {
        enabled: false
    },

    colorAxis: {
        min: 0
    },

    series: [{
        name: 'Population',
        keys: ['name', 'value'],
        joinBy: 'name',
        allAreas: false,
        data: data.sort(), // Sort ascending alphabetically
        dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}',
            style: {
                fontWeight: 'normal',
                opacity: 0.8
            }
        }
    }]
});

// Tweak data table export for less verbosity
Highcharts.addEvent(chart, 'exportData', function (e) {
    // Remove first column
    e.dataRows.forEach(function (dataRow) {
        dataRow.shift();
    });
});


var showChartBtn = document.getElementById('show-chart');
showChartBtn.onclick = function () {
    var chartFigure = document.getElementById('chart-figure');
    if (chartFigure.style.display === 'none') {
        showChartBtn.setAttribute('aria-pressed', 'true');
        chartFigure.style.display = 'block';
        chartFigure.removeAttribute('aria-hidden');
    } else {
        showChartBtn.setAttribute('aria-pressed', 'false');
        chartFigure.style.display = 'none';
        chartFigure.setAttribute('aria-hidden', 'true');
    }
};

document.getElementById('randomize').onclick = function () {
    var randomData = data.map(function (point) {
        return [point[0], Math.round(Math.min(
            Math.random() * 100,
            Math.random() * 100
        ))];
    });
    chart.series[0].setData(randomData);
};

function getSonifyOptions(panMode) {
    var isStereo = panMode === 'stereo';
    var plotTop = chart.plotTop;
    var plotBottom = chart.plotTop + chart.plotHeight;
    var maxFreq = 1319;
    var minFreq = 98;

    return {
        duration: 7000,
        order: 'sequential',
        pointPlayTime: 'plotX',
        onEnd: function (e) {
            e.path.timeline.resetCursor();
        },
        instruments: [{
            instrument: 'sineMusical',
            instrumentMapping: {
                volume: 'value',
                duration: 'value',
                pan: isStereo ? 'plotX' : 0,
                frequency: function (point) {
                    var pointY = point.plotY;
                    var freqDeduction = (maxFreq - minFreq) * (pointY - plotTop) / (plotBottom - plotTop);
                    var freq = Math.round(maxFreq - freqDeduction);
                    return freq;
                }
            },
            // Start at G2 note, end at G6
            instrumentOptions: {
                minVolume: 0,
                maxVolume: 1,
                minDuration: 150,
                maxDuration: 600
            }
        }],
        seriesOptions: {
            onPointStart: function (e) {
                var point = e.options.eventObject;
                point.highlight();
            }
        }
    };
}

document.getElementById('sonify-mono').onclick = function () {
    chart.sonify(getSonifyOptions('mono'));
};

document.getElementById('sonify-stereo').onclick = function () {
    chart.sonify(getSonifyOptions('stereo'));
};

document.getElementById('sonify-by-cursor').onclick = function () {
    if (Highcharts.isHoveringToPlay) {
        return;
    }

    Highcharts.addEvent(chart.container, 'mouseover', function () {
        if (chart.hoverPoint) {
            chart.hoverPoint.sonify({
                instruments: [{
                    instrument: 'sineMusical',
                    instrumentMapping: {
                        volume: 'value',
                        duration: 'value',
                        pan: 'plotX',
                        frequency: 293.66
                    },
                    instrumentOptions: {
                        minVolume: 0.1,
                        maxVolume: 1,
                        minDuration: 150,
                        maxDuration: 600
                    }
                }]
            });
        } else {
            chart.cancelSonify();
        }
    });

    Highcharts.isHoveringToPlay = true;
};

document.getElementById('speak').onclick = function () {
    const speechSynthesis = window.speechSynthesis;

    if (!speechSynthesis || !speechSynthesis.speak) {
        alert('Speech synthesis is disabled or not supported in your browser.');
        return;
    }

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return;
    }

    var values = chart.series[0].points.map(function (x) {
        return x.value;
    });
    var minValue = Math.min.apply(Math, values);
    var maxValue = Math.max.apply(Math, values);

    function clamp(value, min, max) {
        return value > min ? value < max ? value : max : min;
    }

    function virtualAxisTranslate(value, dataExtremes, limits) {
        var lenValueAxis = dataExtremes.max - dataExtremes.min,
            lenVirtualAxis = limits.max - limits.min,
            virtualAxisValue = limits.min +
                lenVirtualAxis * (value - dataExtremes.min) / lenValueAxis;

        return lenValueAxis > 0 ?
            clamp(virtualAxisValue, limits.min, limits.max) :
            limits.min;
    }

    chart.series[0].points.forEach(function (point) {
        var val = point.value;
        var utterance = new SpeechSynthesisUtterance(point.name);
        utterance.lang = 'en-US';
        utterance.pitch = 2 - virtualAxisTranslate(
            val,
            { min: minValue, max: maxValue },
            { min: 0, max: 1.2 }
        );
        utterance.rate = 6 - virtualAxisTranslate(
            val,
            { min: minValue, max: maxValue },
            { min: 1, max: 4.5 }
        );
        utterance.volume = virtualAxisTranslate(
            val,
            { min: minValue, max: maxValue },
            { min: 0.1, max: 1 }
        );
        speechSynthesis.speak(utterance);
    });
};

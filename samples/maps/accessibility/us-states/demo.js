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
            valueDescriptionFormat: '{index}. {xDescription}, {point.value}.'
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

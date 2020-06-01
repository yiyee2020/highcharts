QUnit.test("Web worker thread tests", function (assert) {

    const done = assert.async(1),
        worker = Highcharts.thread(function () {
            this.onmessage = function (message) {
                if (message.data === 123) {
                    this.postMessage({ shout: 'Hello, world!' });
                } else {
                    this.postMessage(false);
                }
            };
        });

    worker.onmessage = function (message) {
        assert.deepEqual(
            message.data,
            { shout: 'Hello, world!' },
            'Data property of thread message should be a shout object.'
        );
        done();
    };

    worker.postMessage(123);

});

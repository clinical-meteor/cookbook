exports.assertion = function(selector, length) {
    this.message = "Testing if element " + selector + " occurs on the page " + length + " times.";

    this.expected = length;

    this.pass = function (value) {
        return value === this.expected;
    };

    this.value = function(result) {
        return result.value.length;
    };

    this.command = function(callback) {
        return this.api.elements(this.client.locateStrategy, selector, callback);
    };

    this.failure = function(result) {
        var failed = result === false || result && result.status === -1;
        if (failed) {
            this.message = "Expected " + selector + " occurs on the page " + length + " times but got " + result + ".";
        }
        return failed;
    };
};

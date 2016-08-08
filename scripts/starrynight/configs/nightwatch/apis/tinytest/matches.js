// for more examples, see https://github.com/nightwatchjs/nightwatch/tree/master/lib/api/assertions

exports.assertion = function (actual, regexp, msg) {

  /**
   * The message which will be used in the test output and
   * inside the XML reports
   * @type {string}
   */
  if (message) {
    this.message = msg;
  } else {
    this.message = "Testing if " + actual + " matches " + regexp + ".";
  }

  /**
   * A value to perform the assertion on. If a function is
   * defined, its result will be used.
   * @type {function|*}
   */

  this.expected = function () {
    return regexp;
  };

  /**
   * The method which performs the actual assertion. It is
   * called with the result of the value method as the argument.
   * @type {function}
   */
  this.pass = function (value) {
    return value.match(regexp);
  };

  /**
   * The method which returns the value to be used on the
   * assertion. It is called with the result of the command's
   * callback as argument.
   * @type {function}
   */
  this.value = function (result) {
    return result.value;
  };

  /**
   * Performs a protocol command/action and its result is
   * passed to the value method via the callback argument.
   * @type {function}
   */
  this.command = function (callback) {

    return this;
  };

};

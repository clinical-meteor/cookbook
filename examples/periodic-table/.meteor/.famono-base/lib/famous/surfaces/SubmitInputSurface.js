Famono.scope('famous/surfaces/SubmitInputSurface', ["famous/surfaces/InputSurface"], function(require, define, exports, module) {
define(function(require, exports, module) {
    var InputSurface = require('famous/surfaces/InputSurface');

    function SubmitInputSurface(options) {
        InputSurface.apply(this, arguments);
        this._type = 'submit';
        if (options && options.onClick) this.setOnClick(options.onClick);
    }

    SubmitInputSurface.prototype = Object.create(InputSurface.prototype);
    SubmitInputSurface.prototype.constructor = SubmitInputSurface;

    SubmitInputSurface.prototype.setOnClick = function(onClick) {
        this.onClick = onClick;
    };

    SubmitInputSurface.prototype.deploy = function deploy(target) {
        if (this.onclick) target.onClick = this.onClick;
        InputSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = SubmitInputSurface;
});

});
Famono.scope('library/meteor/core/Surface', ["famous/core/Surface"], function(require, define, exports, module) {
define(function(require, exports, module) {
    
    
    // Load the original surface
    var Surface = require("famous/core/Surface");
    // Can we define dependencies on Meteo packages here?

    // import Blaze from "blaze@1.0.0";
    // import famous from "https://github.com/Famous/famous.git/src@0.3.0"

    // Export the function
    module.exports = function MeteorSurface(options) {
    var self = this;


    if (!(self instanceof MeteorSurface))
        return new MeteorSurface(options);

    // Create a surface
    var surface = new Surface(options);
    var templateInstance = null;

    surface.deploy = function(target) {
        // On deploy we create the template instance if set
        if (options.template) {
            // Render template instance
            if (options.data) {
                // Create instance with data
                templateInstance = Blaze.renderWithData(options.template, options.data, target);
            } else {
                // Create instance
                templateInstance = Blaze.render(options.template, target);
            }

            templateInstance.surface = surface;
        }
    };

    // Clean up
    surface.cleanup = function(allocator) {
        // Remove template instance
        Blaze.remove(templateInstance);
        // Decouple surface
        templateInstance.surface = null;
        // Empty template instance
        templateInstance = null;
        // Call super
        Surface.prototype.cleanup.call(surface, allocator);
    };

    // Return the modified surface
    return surface;
  };

});

});
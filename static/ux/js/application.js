// Main App Instance
var IndaxoneApp = new Backbone.Marionette.Application();
// Declare Objects
var _g  = {},
    _b  = {};
// Event Aggregator http://stackoverflow.com/a/7843636
_b.evtAgg = _.extend({}, Backbone.Events);
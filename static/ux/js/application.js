// Marionette App Holder
window.App = new Backbone.Marionette.Application();

// Declare Global Objects
var G  = {},
    M  = {};

// Event Aggregator
// ----------------
// A pub-sub object that can be used to decouple various parts
// of an application through event-driven architecture.
//
// Extends [Backbone.Wreqr.EventAggregator](https://github.com/marionettejs/backbone.wreqr)
// and mixes in an EventBinder from [Backbone.EventBinder](https://github.com/marionettejs/backbone.eventbinder).
M.evtAgg = new Marionette.EventAggregator();
// Event Aggregator http://stackoverflow.com/a/7843636
//_b.evtAgg = _.extend({}, Backbone.Events);
// backbone events & attributes
M.events = {};
M.attrs = {};

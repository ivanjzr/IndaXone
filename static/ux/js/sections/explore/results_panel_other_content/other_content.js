OtherContent.View = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(G.templates.find('#other-content-template').html())
});
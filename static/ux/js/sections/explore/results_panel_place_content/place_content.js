
PlaceContent.View = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(G.templates.find('#place-content-template').html())
})
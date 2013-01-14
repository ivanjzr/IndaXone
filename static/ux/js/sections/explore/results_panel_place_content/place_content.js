
PlaceContent.View = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(_g.tmpl.templates.find('#place-content-template').html())
});
OtherContent.View = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(_g.tmpl.templates.find('#other-content-template').html())
});
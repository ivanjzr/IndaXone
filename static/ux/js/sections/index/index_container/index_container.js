
IndexContainer.View = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(G.templates.find('#index-container').html())
});
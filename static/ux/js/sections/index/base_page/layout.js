/* Index Application Layout */
// Index App NameSpace
_b.IndexApp = {};

_b.IndexApp.Layout = Backbone.Marionette.Layout.extend({
    template: Handlebars.compile(_g.tmpl.templates.find('#index-layout-template').html())
});

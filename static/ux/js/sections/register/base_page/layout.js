/* Register Application Layout */
// Register App NameSpace
_b.RegisterApp = {};

_b.RegisterApp.Layout = Backbone.Marionette.Layout.extend({
    template: Handlebars.compile(_g.tmpl.templates.find('#register-layout-template').html())
});

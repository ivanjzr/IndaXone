var IndexContainer = {};

// start objects
IndexContainer.Model = Backbone.Model.extend();
IndexContainer.Collection = Backbone.Collection.extend({
    url:'/', //uri.toString(),
    model:IndexContainer.Model
});

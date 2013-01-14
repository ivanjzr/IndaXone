var PlaceContent = {};

// start objects
PlaceContent.Model = Backbone.Model.extend();
PlaceContent.Collection = Backbone.Collection.extend({
    url:'/', //uri.toString(),
    model:PlaceContent.Model
});

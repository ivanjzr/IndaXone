var SearchList = {};
SearchList.Model = Backbone.Model.extend();
SearchList.Collection = Backbone.Collection.extend({
    model:SearchList.Model
});

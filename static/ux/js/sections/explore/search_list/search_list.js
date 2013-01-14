
SearchList.ItemView = Backbone.Marionette.ItemView.extend({

    tagName:'li',

    template: Handlebars.compile(_g.tmpl.templates.find('#search-list-item-template').html()),

    events:{
        'click .search_list_item': 'on_place_item_click',
        "mouseenter .search_list_item"   : "on_place_item_hover_on"
    },

    initialize: function() {
        _.bindAll(this);
    },

    on_place_item_hover_on: function(ev){
        var self = this;
        var ref_id = $(ev.currentTarget).attr('id');
        _b.evtAgg.trigger('info_window_hover', ref_id);
    },

    on_place_item_click: function(ev){
        var ref_id = $(ev.currentTarget).attr('id');
        // Restore previous
        $('.search_list_item').css('background-color','white');
        // Set new element border
        $('#' + ref_id).css('background-color','#ecf6fb');
    }



});

SearchList.View = Backbone.Marionette.CompositeView.extend({
    tagName:'div',

    template: Handlebars.compile(_g.tmpl.templates.find('#search-list-grid-template').html()),

    itemView: SearchList.ItemView,
    appendHtml: function(collectionView, itemView, index){
        collectionView.$("ul#sl_cv").append(itemView.el);
    },
    onRender: function(){
        // Append 'bottom' class to tr so we can append a bottom border in the search_list.css
        this.$el.attr('id','search_list_container');
    }
});
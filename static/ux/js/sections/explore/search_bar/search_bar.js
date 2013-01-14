
SearchBar.View = Backbone.Marionette.CompositeView.extend({

    input_search_default_value:'Buscar en tu Ciudad',

    template: Handlebars.compile(_g.tmpl.templates.find('#search-bar-template').html()),

    ui: {
        search_input: '#search_location'
    },

    events:{
        'keypress #search_location': 'do_search'
    },

    onRender: function(){
        var self = this;

        this.ui.search_input.focusin(function(){
            $(this).val('');
        });

        this.ui.search_input.focusout(function(){
            // if we have an empty value just return default search value
            /*http://stackoverflow.com/questions/1854556/check-if-inputs-are-empty-using-jquery*/
            if (!$(this).val()){
                $(this).val(self.input_search_default_value);
            }
        });
    },

    do_search: function(evt){
        if (evt.keyCode != 13) return;
        var search_string = this.ui.search_input.val();
        console.log("doing search for " + search_string);
        Backbone.history.navigate('Explore?task=doSearch&q=' + search_string, {trigger: true});
    }


});
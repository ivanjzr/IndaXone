/* Index Application Layout */


IndexApp.Layout = Backbone.Marionette.Layout.extend({

    template: Handlebars.compile(G.templates.find('#index-layout-template').html()),

    regions: {
        'region_index_container' : '#index_section_container'
    },

    initialize: function(){
        _.bindAll(this);
        M.evtAgg.bind('index_tasks_manager', this.tasksManager);
    },

    ui: {

    },

    events: {
        'click #go_explore' : 'go_explore'
    },

    go_explore: function(evt){
        evt.preventDefault();
        Backbone.history.navigate('Explore', {trigger: true});
    },

    onRender: function(){
        /* Load sections */
        this.show_index_section();

        // Hide loading when all content has been loaded
        M.evtAgg.trigger('hide_loading');
    },

    tasksManager: function(params){
        // do task
        console.log("index tasks manager");
    },

    /* Search Bar */
    show_index_section: function(){
        // Append Search Bar
        if( !this.main_index_container){
            this.main_index_container = new IndexContainer.View();
            this.region_index_container.show(this.main_index_container);
        }
    }


});

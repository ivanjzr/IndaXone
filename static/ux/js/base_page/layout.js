/* Main Application Layout */
_b.MainApp.Layout = Backbone.Marionette.Layout.extend({

    template: Handlebars.compile(_g.tmpl.base_page.find('#base-layout-template').html()),

    /* REGIONS */
    regions: {
        'region_base_page_layout' : '#base_page_reg',
        'region_map_canvas' : '#base_map_reg'
    },

    initialize: function(options){
        _.bindAll(this);
        this.options = options;
    },

    onRender: function(){
        /* Render Map */
        this.show_map_section();

        // Render Explore View
        if (this.options.section === 'explore'){
            this.show_explore_section();
        }

        // Trigger task if we have params
        if (this.options.api_params_present){
            _b.evtAgg.trigger('tasks_manager', this.options.params);
        }

    },

    show_explore_section: function(){
        if (!this.ExploreView){
            this.ExploreView = new _b.ExploreApp.Layout();
            this.region_base_page_layout.show(this.ExploreView);
        }
    },

    /* Map Canvas */
    show_map_section: function(){
        // Default city
        var juarez_city = new google.maps.LatLng('31.72004553753411','-106.43798255029299');
        // Default options model
        var mapCanvasModel = new MapCanvas.Model({
            zoom: 13,
            center: juarez_city,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        })
        // backbone view
        var mapCanvasView = new MapCanvas.View({
            model: mapCanvasModel
        });
        // Append Map
        this.region_map_canvas.show(mapCanvasView);
    }



});

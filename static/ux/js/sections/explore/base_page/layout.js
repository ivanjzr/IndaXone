/* Explore Application Layout */
// Explore App NameSpace
_b.ExploreApp = {};

_b.ExploreApp.Layout = Backbone.Marionette.Layout.extend({

    template: Handlebars.compile(_g.tmpl.templates.find('#explore-layout-template').html()),

    /* REGIONS */
    regions: {
        'region_search_bar' : '#search_bar_reg',
        'region_search_list' : '#search_list_reg',
        'region_results_panel' : '#results_panel_reg'
    },

    /* UI ELEMENTS */
    ui: {
        'results_panel': '#results_panel',
        'results_panel_top': '#results_panel_top',
        'results_panel_loading': '#results_panel_loading',
        'restart_btn': '#restart_btn',
        'results_msg': '#result_msg_wrapper',
        'suggestions_msg': '#suggestion_msg_wrapper'
    },

    initialize: function(){
        _.bindAll(this);
        _b.evtAgg.bind('tasks_manager', this.tasksManager);

        // will load results list`
        _b.evtAgg.bind("load_search_results", this.load_search_results);
        // will load panel contet
        _b.evtAgg.bind("load_other_content", this.load_other_content);
        _b.evtAgg.bind("load_place_content", this.load_place_content);
    },

    /*--------------------- MAIN LAYOUT UI EVENTS ------------------------------------------*/
    events:{
        'click #zi':                  'on_zoom_in',
        'click #zo':                  'on_zoom_out',
        'click #restart_btn':         'on_restart',
        'click #close_results_panel': 'on_close_results_panel'
    },
    on_zoom_in: function(e){
        _b.evtAgg.trigger('zoom_in');
    },
    on_zoom_out: function(e){
        _b.evtAgg.trigger('zoom_out');
    },

    on_restart: function(e){
        var self = this;

        /* On click update image to gif */
        var loading_gif = _g.paths.images_path + '/pc_1024x768' + "/loading_arrow.gif";
        var img_size = "width:32px;height:32px;";
        var img_gif = "<img src='" +  loading_gif + "' style='" + img_size + "'>";
        this.ui.restart_btn.html(img_gif);

        setTimeout(function(){
            // Center map to default city
            _b.evtAgg.trigger('restart', {
                setZoom: 13,
                panTo: new google.maps.LatLng('31.72004553753411', '-106.43798255029299')
            });

            // Clear markers and infowindows if any
            _b.evtAgg.trigger("clear_markers");
            _b.evtAgg.trigger("clear_infowindows");

            // clear data from previous searches
            self.clear_search_list(); // if search list just clear
            self.clear_results_msg(); // if results msg just clear
            self.clear_suggestions(); // if suggestions just clear

            //Close panel if opened
            self.close_results_panel_data();

            /* when done restore image to png */
            var loading_png = _g.paths.images_path + '/pc_1024x768' + "/loading_arrow.png";
            var img_size = "width:32px;height:32px;";
            var img_png = "<img src='" + loading_png + "' style='" + img_size + "'>";
            self.ui.restart_btn.html(img_png);

        },1000);
    },
    on_close_results_panel: function(){
        this.close_results_panel_data();
    },

    tasksManager: function(params){
        // do task
        if (params.task){

            // Do search
            if (params.task==='doSearch'){
                var query = params.q;
                _b.evtAgg.trigger('do_search', query);
            }
            // do other
            if (params.task==='displayItem'){
                var ref = params.ref;
                _b.evtAgg.trigger('load_place_content', ref, function(){
                    console.log("content loaded Ok from URL");
                });
            }
        }
    },

    //---------------- Event CallBacks ---------------------------------------------
    load_place_content: function(place_reference, on_complete){
        var self = this;
        _b.evtAgg.trigger('load_place_details', place_reference, function(results){
            // start instances
            var placeContentModel = new PlaceContent.Model(results);
            var placeContentView = new PlaceContent.View({
                model:placeContentModel
            });
            // append view to panel
            self.display_results_panel_data({
                view: placeContentView,
                on_complete: on_complete
            });

        });
    },
    /* load other content to panel, example */
    load_other_content: function(){
        // append view to panel
        this.display_results_panel_data({
            view: new OtherContent.View(),
            on_complete: function(){
                console.log("loaded other content Ok!");
            }
        });
    },



    /*--------------------- Panel Events ------------------------------------------*/
    /* Main Function to display panel results section data */
    display_results_panel_data: function(options){
        var self = this;
        this.ui.results_panel
            .animate({height:500},200, function(){
                // display panel content data
                self.ui.results_panel_top.show();
                self.ui.results_panel_loading.show();

                var img_name = "/loading.gif";
                var img_size = "width:32px;height:32px;";
                var img_loading = "<img src='" + _g.paths.images_path + '/pc_1024x768' + img_name + "' style='" + img_size + "'>";

                self.ui.results_panel_loading.html(img_loading);

                /* Show content section */
                // if panel is already open just close instance view
                if (self.panel_opened){
                    self.region_results_panel.close();
                }
                // Panel is opened
                self.panel_opened = true;
                //Load data
                setTimeout(function(){
                    // display new content
                    self.region_results_panel.show(options.view);
                    // hide loading
                    self.ui.results_panel_loading.hide();
                    // call on complete function
                    options.on_complete();
                },1000);
            })
            .addClass('hide_results_panel');/* Append hide class */
    },

    /* Main Function to close the results panel */
    close_results_panel_data: function(){
        var self = this;

        if( this.ui.results_panel.hasClass('hide_results_panel')) {
            this.ui.results_panel
                .animate({height:0},200, function(){
                    // hide content: close button, content, etc
                    self.ui.results_panel_top.hide();
                    // close view
                    if (self.panel_opened){
                        self.region_results_panel.close();
                        self.panel_opened = false;
                    }
                })
                .removeClass('hide_results_panel');/*remove class*/
        }
        /* force close results panel */
        //this.region_results_panel.close();
    },



    onRender: function(){
        /* Load sections */
        this.show_search_bar_section();


    },

    /* Search Bar */
    show_search_bar_section: function(){
        // Append Search Bar
        if( !this.search_bar ){
            this.search_bar = new SearchBar.View();
            this.region_search_bar.show(this.search_bar);
        }
    },


    display_ui_content: function(ui_el, content){
        ui_el.show();
        ui_el.html(content);
    },

    hide_ui: function(ui_el){
        /* set content to none */
        ui_el.html("");
        /* hide element */
        ui_el.hide();
    },

    hide_results_msg: function(){
        this.hide_ui(this.ui.results_msg);
        this.flag_results_msg = false;
    },

    hide_suggestions: function(){
        this.hide_ui(this.ui.suggestions_msg);
        this.flag_suggestions = false;
    },
    flag_results_msg: false,
    show_results_msg: function(msg){
        this.display_ui_content(this.ui.results_msg, msg);
        this.flag_results_msg = true;
    },

    flag_suggestions: false,
    show_suggestions: function(msg){
        this.display_ui_content(this.ui.suggestions_msg, msg);
        this.flag_suggestions = true;
    },
    clear_results_msg: function(){
        if (this.flag_results_msg == true){
            this.hide_results_msg();
            /*restore flag and debug results*/
            this.flag_results_msg = false;
        }
    },
    clear_suggestions: function(){
        if (this.flag_suggestions == true){
            this.hide_suggestions();
            /*restore flag and debug results*/
            this.flag_suggestions = false;
        }
    },

    flag_search_done: false,
    clear_search_list: function(){
        if (this.flag_search_done == true){
            this.region_search_list.close();
            /*restore flag and debug results*/
            this.flag_search_done = false;
        }
    },


    getResultsContent: function(msg){
        var html = "<div id='results_data'><img src='/static/ux/images/pc_1024x768/oops.png'>" + msg + "</div> ";
        return html;
    },

    getSuggestionsContent: function(msg){
        var html = "<div id='suggestions_data'><img src='/static/ux/images/pc_1024x768/OK-hand.png'>" + msg + "</div> ";
        return html;
    },

    /* Search List */
    load_search_results: function(status, results){
        // debug status
        //console.log("status r: " + status);

        //Close panel if opened
        this.close_results_panel_data();

        // Clear markers and infowindows if any
        _b.evtAgg.trigger("clear_markers");
        _b.evtAgg.trigger("clear_infowindows");

        // clear data from previous searches
        this.clear_search_list(); // if search list just clear
        this.clear_results_msg(); // if results msg just clear
        this.clear_suggestions(); // if suggestions just clear

        // empty value
        if (status==="EMPTY_VALUE"){
            var results_content = this.getResultsContent("Introduce algun criterio de busqueda");
            this.show_results_msg(results_content);
            var suggestion_msg = this.getSuggestionsContent("Te Recomendamos, empty value");
            this.show_suggestions(suggestion_msg);
            return;
        }
        // zero results
        if (status==="ZERO_RESULTS"){
            var results_content = this.getResultsContent("No se encontraron resultados");
            this.show_results_msg(results_content);
            var suggestion_msg = this.getSuggestionsContent("Te Recomendamos, zero results");
            this.show_suggestions(suggestion_msg);
            return;
        }
        // over query
        if (status==="OVER_QUERY_LIMIT"){
            var results_content = this.getResultsContent("Ha ocurrido un error en nuestros servidores");
            this.show_results_msg(results_content);
            var suggestion_msg = this.getSuggestionsContent("Te Recomendamos, over query");
            this.show_suggestions(suggestion_msg);
            return;
        }
        // Ok
        if (status==="OK"){
            // Flag Search Done
            this.flag_search_done = true;
            var searchListCollection = new SearchList.Collection(results);
            this.search_list = new SearchList.View({
                collection:searchListCollection
            });
            // Display search list module
            this.region_search_list.show(this.search_list);
        }
    }/* load search results*/


});

// Main App Router
M.MainApp = {};


M.MainApp.Route = Backbone.Marionette.AppRouter.extend({
    // "someMethod" must exist at controller.someMethod
    appRoutes: {
        ':section' :    'navigate_app'
    },
    /* standard routes can be mixed with appRoutes/Controllers above */
    routes : {
        '*path' :       'defRoute'
    },

    initialize:function(){
        _.bindAll(this);
    },

    defRoute: function(path){
        if (G.activate_redirect){
            window.alert(path + " is not a valid resource");
            Backbone.history.navigate(G.not_found_redirect_url, {trigger: true});
            // Hide loading if any
            M.evtAgg.trigger('hide_loading');
        }
    },

    /*-------------------------------------------- Router Helper Functions --------------------------------------------*/
    has_params: function(){
        if(typeof G.url.params !== "undefined"){
            return true;
        }
        return false;
    },

    param_exists: function(param){
        if(this.has_params()){
            if(typeof G.url.params[param] !== "undefined"){
                return G.url.params[param];
            }
        }
        return false;
    }
});


var sections = [];

M.MainApp.Controller = {

    navigate_app: function(section, params){
        var self = this;

        /* set urls objects */
        G.url          = {};
        G.url.section  = section.toLowerCase();
        G.url.params   = params;

        // if section is not in array append resources and load section
        if ( $.inArray(G.url.section, sections) == -1 ){
            // first load dynamic content
            console.log("seccion nueva: " + G.url.section + ", agregando recursos ");
            // Display Natural Loading
            M.evtAgg.trigger('show_loading');


            M.evtAgg.trigger('load_section', G.url.section, function(){
                // section resources loaded ok
                console.log("resources for " + G.url.section + " loaded ok");
                sections.push(G.url.section);


                    if (!self.mapLoaded){


                        console.log('map started for the first time');
                        // bind map to event, will be triggered when map is ready
                        M.evtAgg.bind('map_ready', function(){
                            // call execURL on same context as there is no initializer to bindAll in Marionette Controller
                            self.execURL({renderSection:true});
                        });


                        M.evtAgg.trigger('load_map_resources', function(){

                            var mapView = new MapCanvas.View({
                                model: new MapCanvas.Model(G.mapOptions) // set model with config options
                            });
                            // Append Map
                            App.base_map.show(mapView);

                            self.mapLoaded = true;

                        });

                    // if we have a new section and map is already loaded just determine section
                    } else {
                        console.log('map already loaded');
                        self.execURL({renderSection:true});
                    }
            });
        } else {
            console.log("section already loaded");
            self.execURL({renderSection:false});
        }
    },



    execURL: function(options){
        var self = this;
        var section_tasks_manager = G.url.section + '_tasks_manager';

        console.log("doing task according to URL");

        // load map when everything is ready
        var options2 = {
            onAppReady:function(){
                console.log("section is ready, triggering tasks manager");
                M.evtAgg.trigger(section_tasks_manager, G.url.params);
                // Hide loading when all content has been loaded
                M.evtAgg.trigger('hide_loading');
            },
            section:G.url.section
        }


        // Render section mandatory first time
        if (options.renderSection){
            // if render section for the first time or no params present render section
            this.renderSection(options2);
        } else {
            // if we have params present just invoke section tasks manager, otherwise render section
            if(typeof G.url.params !== "undefined"){
                // Just execute tasks manager
                M.evtAgg.trigger(section_tasks_manager, G.url.params);
            } else {
                //
                M.evtAgg.trigger('show_loading');
                //
                setTimeout(function(){
                    self.renderSection(options2);
                }, G.section_change_loading_time);
            }
        }

    },/* */



    renderSection: function(options){
        // if we have previous view just reset
        if(G.current_view){
            App.main_content.reset();
        }
        // Render Section
        var sectionApp = capitaliseFirstLetter(options.section) + 'App';
        G.current_view = new window[sectionApp].Layout(options);
        App.main_content.show(G.current_view);
        console.log("Entered section " + options.section);
    }




};
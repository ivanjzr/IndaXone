// Main App Router
_b.MainApp = {};

_b.MainApp.Route = Backbone.Router.extend({

    /*https://github.com/jhudson8/backbone-query-parameters#example-route-patterns*/
    routes: {
        //'*path' : 'defaultRoute'
        ':section' :        'explore_application'
    },

    // Sections container
    app_sections:[],

    //
    initialize: function() {
        _.bindAll(this);
    },

    /*------------------ views -------------------------*/
    explore_application: function(section, params){
        var self = this;

        /* report */
        //console.log("App Section: " + section);
        //console.log("App Params: "); console.log(params);

        /* set urls objects */
        _g.url          = {};
        _g.url.section  = section.toLowerCase();
        _g.url.params   = params;

        // Set an array of sections, if section was already initialized then do initialize it again
        if ( $.inArray(_g.url.section, this.app_sections) == -1 ){
            // first load dynamic content
            console.log("seccion nueva: " + _g.url.section + ", inicializando contenido ");
            _b.evtAgg.trigger('initialize_module_paths', _g.url.section, function(){
                _b.evtAgg.trigger('load_page_resources', _g.url.section, function(){
                    // section resources loaded ok
                    self.app_sections.push(_g.url.section);
                    // Load singleton static content
                    if (!self.staticContentLoaded){
                        self.loadStaticContent();
                    }
                });
            });
        } else {
            console.log("contenido para la seccion " + _g.url.section + " ya existe, hacer trigger de las tareas ");
            // do we have params?
            // http://stackoverflow.com/questions/27509/detecting-an-undefined-object-property-in-javascript
            if(typeof _g.url.params !== "undefined"){
                _b.evtAgg.trigger('tasks_manager', _g.url.params);
            }
        }
    },/* Function End */



    // will load static main content only once
    loadStaticContent: function(){
        var self = this;
        _b.evtAgg.trigger('load_map_resources', function(){

            _b.evtAgg.trigger('load_base_page', function(){
                // Add html page body as a region
                IndaxoneApp.addRegions({
                    body: "body"
                });
                // default main layout options
                var main_layout_options = {
                    section:_g.url.section,
                    api_params_present: false
                }
                // How will be accesing the app for the first time??
                if(typeof _g.url.params !== "undefined"){
                    // do we have a task param?
                    if (_g.url.params.task){
                        // Create and set base layout
                        main_layout_options.api_params_present = true;
                        main_layout_options.params = _g.url.params;
                    }
                }
                // render main app view
                self.mainPageLayout = new _b.MainApp.Layout(main_layout_options);
                IndaxoneApp.body.show(self.mainPageLayout);

                // flag static content loaded
                self.staticContentLoaded = true;
            });
        });
    }

});


IndaxoneApp.addInitializer(function(options){
    // add functions
});
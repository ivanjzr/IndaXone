// Marionette Application Loader
M.AppLoader = App.module("AppLoader", {

    // this module needs to be started before routing
    startWithApp: false,
    //
    define: function(self){

        //
        self.addInitializer(function(){
            // Bind all methods to this context
            _.bindAll(this);

            M.evtAgg.bind('load_section', this.load_section);
            M.evtAgg.bind('load_base_page', this.load_base_page);
            M.evtAgg.bind('load_map_resources', this.load_map_resources);

        });

        //
        self.load_section = function(section_path, on_complete){
            /* Append Paths Dynamycally */
            var js_section_paths = G.paths.js_path + '/sections/' + section_path + '/paths.js';
            $.ajax({
                type: 'GET',
                url: js_section_paths,
                error: function(jqXHR, status, errorThrown){
                    window.alert("Section not found");
                    // if we fail to load the template just redirect to valid URL
                    Backbone.history.navigate(G.not_found_redirect_url, {trigger: true});
                },
                success: function(data, status, jqXHR){

                    var section = capitaliseFirstLetter(section_path);
                    var full_section = section + G.AppSectionsPrefix;

                    // if we have the object then include the rest
                    if(typeof window[full_section] !== "undefined"){
                        self.load_page_resources(section_path, full_section, on_complete);
                    }

                }
            });
        }

        //
        self.load_page_resources = function(section_path, full_section, on_complete){


            /* Safety Load CSS */
            var css_res = validate_resources( window[full_section].styles, 'css');
            if (css_res.result==='err'){
                console.log("failed to load a css module, unable to continue");
                return;
            }
            var css_base_path = G.paths.css_path + '/' + section_path;
            var css_path_array = map_path_array(css_res.paths_array, css_base_path);
            _.each(css_path_array, function(css_item_path){
                appendCSS(css_item_path);
                // Report css
                //console.log("a css: " + css_item_path + " loaded OK ");
            });


            /* Safety Load HTML Templates */
            var tmpl_res = validate_resources( window[full_section].templates, 'html');
            if (tmpl_res.result==='err'){
                console.log("failed to load an html template, unable to continue");
                return;
            }
            //
            var tmpl_base_path = G.paths.tmpl_path + '/' + section_path;
            var tmpl_path_array = map_path_array(tmpl_res.paths_array, tmpl_base_path);
            // Append template data
            appendTemplateData( tmpl_path_array, G.templates, function(completed){

                // If template append goes Ok just add template js
                if (completed){

                    /* Safety Load Javascript Modules */

                    // if we an empty list of modules just bypass
                    if (window[full_section].modules.length===0){
                        on_complete();
                        return;
                    }

                    var mod_res = validate_resources( window[full_section].modules, 'js');
                    if (mod_res.result==='err'){
                        console.log("failed to load a module, unable to continue");
                        return;
                    }
                    var mod_base_path = G.paths.js_path + '/sections/' + section_path;
                    var mod_path_array = map_path_array(mod_res.paths_array, mod_base_path);
                    // Load Javascripts
                    yepnope({
                        load: mod_path_array,
                        complete:function(){
                            on_complete();
                        }
                    });

                } else {
                    console.log("failure, unable to load section resources ");
                }

            });


        }/* function end */




        self.load_map_resources = function(on_complete){
            // Load base map js
            var base_map_model      = G.paths.js_path + '/base_map/a_model.js';
            var base_map_canvas     = G.paths.js_path + '/base_map/map_canvas.js';
            yepnope({
                load: [base_map_model, base_map_canvas],
                complete:function(){
                    on_complete();
                }
            });
        }/* function end */



        self.load_base_page = function(on_complete){
            /* LOAD RWD CSS */
            /*http://en.wikipedia.org/wiki/Responsive_web_design*/
            /*http://css-tricks.com/snippets/css/media-queries-for-standard-devices */
            /*http://stackoverflow.com/questions/5170931/detecting-screen-resolution-to-load-alternative-css-a-good-idea*/
            var base_page_css = _g.paths.css_path + '/base_page/layout.css';
            appendCSS(base_page_css);

            // Load base page layout
            var base_page_tmpl = _g.paths.tmpl_path + '/base_page/layout.html';
            var validation = validate_resources( base_page_tmpl, 'html');
            // if validation goes OK
            if (validation.result==='ok'){
                // Get filtered templates
                var base_page_tmpl = validation.paths_array[0];
                // Append validated template
                appendTemplateData( base_page_tmpl, _g.templates, function(response){
                    // If template append goes Ok just add template js
                    if (response){
                        // Load base page Javascripts
                        var base_page_model      = _g.paths.js_path + '/base_page/model.js';
                        var base_page_layout     = _g.paths.js_path + '/base_page/layout.js';
                        yepnope({
                            load: [base_page_model, base_page_layout],
                            complete:function(){
                                on_complete();
                            }
                        });
                    } else {
                        console.log("failure, unable to load base page application");
                    }
                });
            }
        }/* function end */



    }/* end define */
});





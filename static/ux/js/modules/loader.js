
// Loader module
IndaxoneApp.module("initialize_application_module", {
    //
    startWithApp: true,
    //
    define: function(self){
        //
        self.addInitializer(function(){
            // Bind all methods to this context
            _.bindAll(this);

            _b.evtAgg.bind('initialize_module_paths', this.initialize_module_paths);
            _b.evtAgg.bind('load_page_resources', this.load_page_resources);
            _b.evtAgg.bind('load_base_page', this.load_base_page);
            _b.evtAgg.bind('load_map_resources', this.load_map_resources);

        });

        //
        self.initialize_module_paths = function(section_path, on_complete){
            /* Append Paths Dynamycally */
            var js_section_paths = _g.paths.js_path + '/sections/' + section_path + '/paths.js';
            yepnope({
                load: [js_section_paths],
                complete:function(){
                    on_complete();
                }
            });
        }
        //
        self.load_page_resources = function(section_path, on_complete){

            /* Load CSS */
            if (!window.css){
                //window.alert("Css not Available for this module");
                return;
            } else {
                var css_res = validate_resources( window.css, 'css');
                if (css_res.result==='err'){
                    console.log("failed to load a css module, unable to continue");
                    return;
                }
                var css_base_path = _g.paths.css_path + '/' + section_path;
                var css_path_array = map_path_array(css_res.paths_array, css_base_path);
                _.each(css_path_array, function(css_item_path){
                    appendCSS(css_item_path);
                    // Report css
                    //console.log("a css: " + css_item_path + " loaded OK ");
                });
            }/* function end */

            //Load Templates
            if (!window.templates){
                //window.alert("Templates not Available for this module");
                return;
            } else {
                // validate templates path
                var tmpl_res = validate_resources( window.templates, 'html');
                if (tmpl_res.result==='err'){
                    console.log("failed to load an html template, unable to continue");
                    return;
                }
                //
                var tmpl_base_path = _g.paths.tmpl_path + '/' + section_path;
                var tmpl_path_array = map_path_array(tmpl_res.paths_array, tmpl_base_path);
                // Append template data
                appendTemplateData( tmpl_path_array, _g.tmpl.templates, function(response){
                    // If template append goes Ok just add template js
                    if (response){
                        // Load Javascripts
                        if (!window.modules){
                            //window.alert("Templates not Available for this module");
                            return;
                        } else {

                            // if we an empty list of modules just bypass
                            if (window.modules.length===0){
                                on_complete();
                                return;
                            }

                            var mod_res = validate_resources( window.modules, 'js');
                            if (mod_res.result==='err'){
                                console.log("failed to load a module, unable to continue");
                                return;
                            }
                            var mod_base_path = _g.paths.js_path + '/sections/' + section_path;
                            var mod_path_array = map_path_array(mod_res.paths_array, mod_base_path);
                            // Load Javascripts
                            yepnope({
                                load: mod_path_array,
                                complete:function(){
                                    on_complete();
                                }
                            });
                        }
                    } else {
                        console.log("failure, unable to load section resources ");
                    }
                });
            }/* ---- end function --- */
        }/* function end */

        self.load_map_resources = function(on_complete){
            // Load base map js
            var base_map_model      = _g.paths.js_path + '/base_map/a_model.js';
            var base_map_canvas     = _g.paths.js_path + '/base_map/map_canvas.js';
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
                appendTemplateData( base_page_tmpl, _g.tmpl.base_page, function(response){
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





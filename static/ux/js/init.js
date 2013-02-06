// Load App config
G.page = {};
var pathArray       = window.location.pathname.split('/');

// get request page
var page_array      = pathArray[pathArray.length - 1];
G.page.url_parts    = page_array;
G.page.current      = page_array.split('.')[0];


// Store App Paths
G.paths = {};
G.paths.api_path         = '/static/ux';
G.paths.js_path          = G.paths.api_path + '/js';
G.paths.css_path         = G.paths.api_path + '/css';
G.paths.tmpl_path        = G.paths.api_path + '/templates';
G.paths.images_path      = G.paths.api_path + '/images';

// load templates object
G.templates = $('<div></div>');

// Application section prefix defined in each path.js
G.AppSectionsPrefix = 'App';

// If we have activated a redirect then provide redirect URL
G.activate_redirect = true;
G.not_found_redirect_url = 'Explore';
// How many time to wait while loading section
G.section_change_loading_time = 1000;


// --------- Map Options
// Default city: Juarez, Chih. Mex.
var default_city = new google.maps.LatLng('31.72004553753411','-106.43798255029299');
// Default options model
G.mapOptions = {
    zoom: 13,
    center: default_city,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
}



// Preloader operations
M.evtAgg.bind('show_loading', function(){
    $('.preloading').show();
});
M.evtAgg.bind('hide_loading', function(){
    $('.preloading').hide();
});


// Add application Main regions
App.addRegions({
    base_map : '#base_map_reg',
    main_content : '#main_content'
})

// Load application loader
yepnope({
    load: G.paths.js_path + '/loader.js',
    callback:function(url, result, key){

        if(typeof M.AppLoader !== "undefined"){
            // Load loader before routing main application
            M.AppLoader.start();

            // load the app router
            yepnope({
                load: G.paths.js_path + '/route.js',
                complete:function(){

                    // Initialize router
                    App.addInitializer(function(options){

                        // Route Main App
                        new M.MainApp.Route({
                            controller : M.MainApp.Controller
                        });
                        // start history
                        Backbone.history.start();
                        console.log("listening to routes");

                    });

                }

            });

        } else {
            alert("unable to load application loader");
        }


    }
});



$(document).ready(function(){
    App.start();
})
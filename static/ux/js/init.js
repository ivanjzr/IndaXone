$(document).ready(function(){
    // Main App Initializer (it can also call modules manually)
    IndaxoneApp.start();

    // ------------- LOAD PATHS DINAMYCALLY FOR RESPONSIVE WEB DESIGN --------------------
    // Set the page object and properties
    _g.page = {};
    var pathArray       = window.location.pathname.split('/');
    // get request page
    var page_array      = pathArray[pathArray.length - 1];
    _g.page.url_parts   = page_array;
    _g.page.current     = page_array.split('.')[0];

    // Store App Paths
    _g.paths = {};
    _g.paths.api_path         = '/static/ux';
    _g.paths.js_path          = _g.paths.api_path + '/js';
    _g.paths.css_path         = _g.paths.api_path + '/css';
    _g.paths.tmpl_path        = _g.paths.api_path + '/templates';
    _g.paths.images_path      = _g.paths.api_path + '/images';

    // backbone events & attributes
    _b.attrs = {};
    _b.events = {};

    // load templates object
    _g.tmpl = {};
    // set main app base page template
    _g.tmpl.base_page       = $('<div></div>');
    // set app templates content
    _g.tmpl.templates       = $('<div></div>');

    // Load main app router, when complete execute routing
    yepnope({
        load: [_g.paths.js_path + '/route.js'],
        complete:function(){
            // when loading is complete call the main app route
            new _b.MainApp.Route();
            Backbone.history.start();
            console.log("Listening to Routes");
        }
    });


})
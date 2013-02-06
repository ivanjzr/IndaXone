
MapCanvas.View = Backbone.Marionette.CompositeView.extend({

    /*Globals*/
    map:null,
    geocoder:null,
    service:null,
    infowindow:null,
    map_search_location:null,
    // Markers and infowindows Arrays
    infowindowsArray:[],
    markersArray:[],

    initialize: function(options) {
        _.bindAll(this);

        // Map Tools
        M.evtAgg.bind('zoom_in', this.on_zoom_in);
        M.evtAgg.bind('zoom_out', this.on_zoom_out);
        M.evtAgg.bind('restart', this.on_restart);
        M.evtAgg.bind('get_zoom', this.get_zoom);

        // clearers
        M.evtAgg.bind('clear_markers', this.clear_markers);
        M.evtAgg.bind('clear_infowindows', this.clear_infowindows);

        /* hover on & hover off */
        M.evtAgg.bind('info_window_hover', this.info_window_hover);

        // do a search
        M.evtAgg.bind('do_search', this.do_search);
        // load details from selected place
        M.evtAgg.bind('load_place_details', this.load_place_details);

    },

    render: function() {
        //carrying map options from model
        var map_options = this.model.toJSON();
        //just initialize for geocode searches
        this.geocoder = new google.maps.Geocoder();
        this.map_search_location = map_options.center;
        // Start map with location
        this.map = new google.maps.Map(this.$el[0], map_options);
        /*
         google.maps.event.addListener(this.map, "click", function(){
         var latlng = self.map.getCenter();
         console.log(latlng);
         });
         */
        this.$el.width('100%');
        this.$el.height('100%');

        // Hide preloader on map ready
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
            // do something when map has finished loaded
            M.evtAgg.trigger('map_ready');
        });


    },

    info_window_hover: function(ref_id){
        var self = this;
        this.service.getDetails({ reference: ref_id}, function(place_details){
            self.map.panTo(place_details.geometry.location);
            // Clear previous info windows arrays
            self.clear_infowindows();
            // Display new info window
            self.display_info_window_simple(place_details, self.infowindowsArray);
        });
    },

    on_restart: function(map_options) {
        this.map.setZoom( map_options.setZoom );
        this.map.panTo( map_options.panTo);
        this.clear_markers();
        this.clear_infowindows();
    },

    on_zoom_in: function(){
        this.map.setZoom( this.map.getZoom()-1 );
    },

    get_zoom: function(callback){
        zoom_param = this.map.getZoom();
        callback( zoom_param );
    },

    on_zoom_out: function(){
        this.map.setZoom( this.map.getZoom()+1 );
    },



    do_search: function(query) {
        var self = this;

        console.log("Doing Search For " + query);

        var search_input_array = query;
        if (!query || query===""){

            // No lo encuentra por que todavia no esta registrado
            M.evtAgg.trigger('load_search_results', 'EMPTY_VALUE', '');
        }


        var request = {
            location: this.map_search_location,
            radius: '15000',
            query: search_input_array,
            language: 'es',
            key: 'AIzaSyBO5NLGs9qYwYjWTBZ231anwru2UWW8cSI'
        };

        // Search place
        this.service = new google.maps.places.PlacesService(this.map);
        // Append results
        this.service.textSearch(request, function(results, status ) {

            M.evtAgg.trigger('load_search_results', status, results);


            // Iterate through search results
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // Iterate to load Markers
                for (var i = 0; i < results.length; i++) {
                    // draw markers
                    self.createPlaceMarker(results[i], self.markersArray, self.infowindowsArray);
                }
            }
        });


    },



    clear_markers: function(){
        for (var i = 0; i < this.markersArray.length; i++ ) {
            this.markersArray[i].setMap(null);
        }
        this.markersArray.length = 0;
    },

    clear_infowindows: function(){
        for (var i = 0; i < this.infowindowsArray.length; i++ ) {
            this.infowindowsArray[i].close();
        }
        /*http://stackoverflow.com/a/1234337*/
        this.infowindowsArray.length = 0;
    },

    previous_list_item_reference:false,

    createPlaceMarker: function(place_data, markersArray, infowindowsArray){
        var self = this;
        // set marker icons
        var pinIcon = new google.maps.MarkerImage(
            place_data.icon,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(35, 35)
        );
        // Add new marker item
        var marker = new google.maps.Marker({
            map: self.map,
            position: place_data.geometry.location,
            title: place_data.name,
            icon: pinIcon
        });
        // push new marker item into the markersArray
        markersArray.push(marker);

        // On marker click display info window
        google.maps.event.addListener(marker, 'click', function() {

            self.map.panTo(this.getPosition());
            var ref_anchor = place_data.reference;

            /*
             // Restore previous element border if any
             if (self.previous_list_item_reference){
             $('#' + self.previous_list_item_reference).css('border','2px solid #92C6EE');
             }
             */
            $('.search_list_item').css('background-color','white');

            // Add reference to current list item
            self.previous_list_item_reference = ref_anchor;

            // Set new element border
            $('#' + ref_anchor).css('background-color','#ecf6fb');

            // Scroll to anchor
            $.scrollTo('#' + ref_anchor, 1500, {
                easing:'swing',
                onAfter: function(){
                    //console.log("scrolled to item + ");
                },
                // Set top offset to fit on top-wrapper height.
                offset:-130
            });
            // Clear previous info windows arrays
            self.clear_infowindows();
            // Display new info window
            self.display_info_window_simple(place_data, infowindowsArray);
        });
    },

    /* load place details */
    load_place_details: function(place_reference, callback){
        var self = this;
        this.service.getDetails({ reference: place_reference }, function(place_details){
            self.map.panTo(place_details.geometry.location);
            // clear infowindows and load selected one
            self.clear_infowindows();
            self.display_info_window_simple(place_details, self.infowindowsArray);
            callback(place_details);
        });
    },

    /* Display an Info Window in a Simple View */
    display_info_window_simple: function(place, infowindowsArray){
        var infowindow = new google.maps.InfoWindow();
        var contentString = "simple view <b> " + place.name + "</b><br />" + place.formatted_address + ", <br /> load business details <a href='#Explore?task=displayItem&ref=" + place.reference + "'> Ver Detalles </a>";
        infowindow.setContent(contentString);
        infowindow.setPosition(place.geometry.location);
        infowindow.open(this.map);
        // push new infowindow into the infowindwsArray
        infowindowsArray.push(infowindow);
    }

});
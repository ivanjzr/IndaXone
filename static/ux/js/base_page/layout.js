
/* Main Application Layout */

_b.MainApp.Layout = Backbone.Marionette.Layout.extend({


    template: Handlebars.compile(_g.tmpl.base_page.find('#base-layout-template').html()),


    /* REGIONS */
    regions: {
        'region_base_page_layout' : '#base_page_reg'
    },


    initialize: function(){

        _.bindAll(this);
        _b.evtAgg.bind('render_section', this.onRender, this);

    },

    /* we need this empty function */
    render: function(){
        console.log("rendering once");
    },



    onRender: function(render_options){
        //
        this.options = render_options;

        console.log("printing current options");
        console.log(this.options);

        // if we don't have tasks to do just display view
        if(typeof this.options.params === "undefined"){
            console.log("Determine View");

            // if we have previous call just close
            if (this.section_called){
                this.region_base_page_layout.close();
            }

            // Render Explore View
            if (this.options.section === 'explore'){

                this.ExploreView = new _b.ExploreApp.Layout();
                this.region_base_page_layout.show(this.ExploreView);
                console.log("calling explore once");

                // flag section called
                this.section_called = true;
            }

            // Render Explore View
            if (this.options.section === 'index'){
                console.log("calling index");

                this.IndexView = new _b.IndexApp.Layout();
                this.region_base_page_layout.show(this.IndexView);
                // flag section called
                this.section_called = true;
            }


        } else {

            // Dynamically trigger section
            _b.evtAgg.trigger(_g.url.section + '_tasks_manager', _g.url.params);

        }


    }





});

// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
//     ie === undefined
// If you're in IE (>=5) then you can determine which version:
//     ie === 7; // IE7
// Thus, to detect IE:
//     if (ie) {}
// And to detect the version:
//     ie === 6 // IE6
//     ie > 7 // IE8, IE9 ...
//     ie < 9 // Anything less than IE9
// ----------------------------------------------------------
// UPDATE: Now using Live NodeList idea from @jdalton

var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );

    return v > 4 ? v : undef;

}());


function has(str, val){
    if (str.indexOf(val) !== -1){
        return true;
    }
    return false;
}



function validateEmail(emailText) {
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (pattern.test(emailText)) {
        return true;
    } else {
        alert('Email incorrecto: ' + emailText);
        return false;
    }
}



function appendCSS(css_href, extra_tags){
    //First append CSS
    var new_css = $("<link rel='stylesheet' " + extra_tags + " >");
    new_css.attr('href', css_href);
    $('head').append(new_css);
}

/* this pretty cool function will append templates dynamically */
function appendTemplateData(tmpl_path, append_to_obj, on_completed){
    // are we dealing with an array?
    /*http://stackoverflow.com/questions/767486/how-do-you-check-if-a-variable-is-an-array-in-javascript*/
    if (tmpl_path instanceof Array) {
        //console.log("loading an array");
        var on_completed_semaphore = tmpl_path.length;
        _.each( tmpl_path, function(template_item_path){
            $.ajax({
                type: 'GET',
                url: template_item_path,
                error: function(jqXHR, status, errorThrown){
                    // if we fail to load a single template do not continue
                    on_completed(false);
                    return;
                },
                success: function(data, status, jqXHR){
                    // Append data for current template item
                    append_to_obj.append(data);
                    // Rest less 1
                    on_completed_semaphore = on_completed_semaphore - 1;
                    // if iterated all ok
                    if (on_completed_semaphore === 0){
                        on_completed(true);
                    }
                }
            });
        });
        // is not an array
    } else {
        //console.log("loading single template");
        $.ajax({
            type: 'GET',
            url: tmpl_path,
            error: function(jqXHR, status, errorThrown){
                // if we fail to load the template do not continue
                on_completed(false);
                return;
            },
            success: function(data, status, jqXHR){
                // append data and execute completed
                append_to_obj.append(data);
                on_completed(true);
            }
        });
    }
}




function validate_resources(resource, type){
    var filtered_array = [];
    var failed_array = [];
    var retObj = {};

    if (resource instanceof Array) {
        //console.log("validating an array of resources");
        _.each( resource, function(resource_path){
            var splited_path = resource_path.split('/');
            var path = splited_path[splited_path.length - 1];
            if (has(path, '.' + type)){
                //console.log("element " + path + ", with type " + type + ', included just fine')
                filtered_array.push(resource_path);
            } else {
                //console.log("failed to include " + path + ', not a valid ' + type + ' file');
                failed_array.push(resource_path);
            }
        });
    } else {
        //console.log("validating a single resource");
        var splited_path = resource.split('/');
        var path = splited_path[splited_path.length - 1];
        if (has(path, '.' + type)){
            //console.log("element " + path + ", with type " + type + ', included just fine')
            filtered_array.push(resource);
        } else {
            //console.log("failed to include " + path + ', not a valid ' + type + ' file');
            failed_array.push(resource);
        }
    }
    if (failed_array.length > 0){
        retObj.result = 'err';
        retObj.paths_array = failed_array;
        return retObj;
    }
    retObj.result = 'ok';
    retObj.paths_array = filtered_array;
    return retObj;
}


function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}


var map_path_array = function(arr, base_path ){
    return _.map( arr, function(el_path){
        return base_path + el_path;
    })
}

/**
 * Created by adamcee on 7/11/17.
 */

function validEmail(email) { // see:
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
// get all data in form and return object
function getFormData() {
    var elements = document.getElementById("gform").elements; // all form elements

    //console.log('elements ', elements);

    var fields = Object.keys(elements).map(function(k) {
        //console.log('map fields, elements, key k ', k);
        //console.log('element k.name - ', elements[k].name);
        //console.log('element k - ', elements[k]);

        if(elements[k].name !== undefined && elements[k].name.length) {
            //console.log('if elements of key k has a defined name prop ', elements[k].name);
            return elements[k].name;
            // special case for Edge's html collection
        }
        else if(elements[k].length > 0){
            console.log('else if elements  of key k has length > 0', elements[k].item(0).name);
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        // get rid of dupes
        return self.indexOf(item) == pos;
    }).filter(function(item, pos, self){
        // get rid of undefined
        return item != undefined;
    });

    console.log('fields ', fields);

    var data = {};
    fields.forEach(function(k){

        console.log('fields foreach - key - ', k);

        data[k] = elements[k].value;

        console.log('fields foreach - data accumulator obj - ', data);
        var str = ""; // declare empty string outside of loop to allow
                      // it to be appended to for each item in the loop
        if(elements[k].type === "checkbox"){ // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append
                                                    // the current checked value to
                                                    // the end of it, along with
                                                    // a comma and a space
            data[k] = str.slice(0, -2); // remove the last comma and space
                                        // from the  string to make the output
                                        // prettier in the spreadsheet
        }else if(elements[k].length){
            for(var i = 0; i < elements[k].length; i++){
                if(elements[k].item(i).checked){
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });

    console.log('data ', data);

    return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData();         // get the values submitted in the form
    if( !validEmail(data.email) ) {   // if email is not valid show error
        document.getElementById('email-invalid').style.display = 'block';
        return false;
    } else {
        var url = event.target.action;  //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            console.log( xhr.status, xhr.statusText )
            console.log(xhr.responseText);
            document.getElementById('gform').style.display = 'none'; // hide form
            document.getElementById('thankyou_message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
    }
}
function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    var form = document.getElementById('gform');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);

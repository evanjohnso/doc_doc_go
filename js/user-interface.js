import { DocDoc as logic } from './../js/logic.js';

$(document).ready(function() {
logic.getSpeciality()                       //load specialties with document
      .then(displayDropdown)                //displayDropdown callback function
      .catch( function(errorObject) {       //catch any rejections of promises
        alert(errorObject);
      });

  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    let location = $('input[name="userInputLocation"]').val();
    let specialty = $('select[name="specialty"]').val();
    $('#outputs').children().remove(); //clear previous searches
    $('input').val('');
    logic.getLatLon(location, specialty)
      .then(logic.getDoctors)
      .then(displayDoctors)
      .catch( function (error) {
        alert("Sorry, there seems to be an error: " + error);
      });
  });

  function displayDoctors(jsonArray) {
    let $display = $('#outputs');
    if (jsonArray.length == 0) {
      return $display.html("<h1>Sorry, looks like we have no doctors. Please try your search again!<//h1>")
                .css('text-align', 'center');
    }
    jsonArray.forEach(function(doctor) {
      //if string is too big, truncate to the closes end sentance
      let bioString = doctor.bio;
      if (bioString.length == 0) {
        bioString = "No bio for this doctor available.";
      } else if (bioString.length > 1000) {
        let endString = bioString.indexOf('.', 1000);
        bioString = bioString.slice(0, endString);
      }
        $display.append( `<div class='item'>
                            <h3>${doctor.first} ${doctor.last}, ${doctor.title}</h3>
                            <h4>${doctor.speciality}</h4>
                            <img src="${doctor.picture}" alt='No picture to display'>
                            <h5>${bioString}</h5>
                          </div>`
                        );
    });
  }
  function displayDropdown(jsonArray) {
      //scrub data from (xx-xx-xx) to (Xx xx xx)
      let sorted = jsonArray.data.map( function(element) {
        let changing = element.uid.split('-').join(' ');
        return changing.toString().charAt(0).toUpperCase() + changing.toString().slice(1);
      });
      //alpha sort and append list options
      sorted.sort();
      sorted.forEach(function(element) {
        $('select[name="specialty"]').append(`<option value="${element}">${element}</option>`);
    });
  }



});

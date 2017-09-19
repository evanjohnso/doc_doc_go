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
    sessionStorage.clear();
    $('input').val('');
    //call google geocode to find doctors within this location and speciality
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
      } else if (bioString.length > 700) {
        let endString = bioString.indexOf('.', 650);
        bioString = bioString.slice(0, endString);
      }
        $display.append( `<div class='item'>
                            <h3>${doctor.first} ${doctor.last}, ${doctor.title}</h3>
                            <h4>${doctor.speciality}</h4>
                            <img src="${doctor.picture}" alt='No picture to display'>
                            <h5 id="${doctor.uid}" data-toggle="modal" data-target="#myModal">${bioString}</h5>
                          </div>`
                        );
    });

    $('.item h5').on('click', function(e) {
      logic.callDoctor(
        $(e.target).attr('id'))
        .then(modal)
        .catch( function(error) {
          alert(error);
        });
    });
  }
  $('#close').on('click', function(e) {
    e.preventDefault();
    $(e.target).parent().nextAll().slideDown(1000);
    $(e.target).parent().slideUp(1000);

  });
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

  function modal(doctorInfo) {
    //filter out only doctors accepting new patients

    let activeOffices = doctorInfo.practices.filter (function(location) {
      return location.accepts_new_patients;
    });
    // console.log(activeOffices);
    let address = activeOffices[0].visit_address;
    address = `${address.street} ${address.city}, ${address.state} ${address.zip}`;
    let number = activeOffices[0].phones[0].number;
    number = `${number.slice(0,3)}-${number.slice(3,6)}-${number.slice(6)}`;
    let coords = `${activeOffices[0].lat}, ${activeOffices[0].lon}`;
    let userLocation = sessionStorage.getItem('userLocation');
    $('#officeCoords').text(coords);
    $('#userLocation').text(userLocation);
    $("#number").text(number);
    $('#address').text(address);
    $('#fakeModal').slideDown(1000);
    $('#fakeModal ~ ').slideUp(1000);
    userLocation = userLocation.slice(0, userLocation.length-3);
    let split = userLocation.split(',');
    let myObject = {
      lat: parseFloat(split[0]),
      lng: parseFloat(split[1])
    };
    let office = {
      lat: parseFloat(`${activeOffices[0].lat}`),
      lng: parseFloat(`${activeOffices[0].lon}`)
    };
    initializeMap(myObject, office);
    }
    function initializeMap(ourLocation, officeLocation) {
      let ourMap = new google.maps.Map(document.getElementById('bikeMap'), {
      center: ourLocation,
      zoom: 10
    });
    let anothermarker = new google.maps.Marker({
       position: ourLocation,
       map: ourMap,
       title: 'Bike!'
    });
    let marker = new google.maps.Marker({
       position: officeLocation,
       map: ourMap,
       title: 'Bike!'
    });
  }

});

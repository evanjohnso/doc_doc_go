var apiKey = require('./../.env').apiKey;

$(document).ready(function() {

getSpeciality()
  .then(displayDropdown);              //displayDropdown callback function
  // .catch(function(errorObject) {      //catch any rejections of promises
  //   alert(errorObject);
  // });

  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    let location = $('input[name="userInputLocation"]').val();
    // let condition = $('input[name="userInputCondition"]').val();
    let specialty = $('select[name="specialty"]').val();
    // console.log(specialty);
    let latLon = '45.5230622,-122.67648150000002,15';
    // getLatLon(location, specialty);
    // getDoctors(latLon, specialty);
    $('input').val('');
  });

  // function getLatLon(location, specialty) {
  //   return new Promise( function(resolve, reject) {
  //   let geocoder = new google.maps.Geocoder();
  //   geocoder.geocode( { address: location }, function(results) {
  //     let lat = results[0].geometry.location.lat();
  //     let lng = results[0].geometry.location.lng();
  //     let coordinates = `${lat},${lng},15`; //last parameter is the search radius
  //     console.log(coordinates);
  //     resolve(coordinates, specialty);
  //     reject("Google's geocoder failed, the servers are down. We're all fucked.");
  //     });
  //   });
  // }
  // getLatLon("Portland, OR");


  // getLatLon("portland, or", "dentist")
  //   .then(getDoctors)
  //   .catch( function(error) {
  //     console.log('this is the error' + error);
  //   });
  // getDoctors(latLon, 'acupuncture')
  //   .then(displayDoctors);

  function getDoctors(searchLocation, speciality) {
    return new Promise( function(resolve, reject) {
      $.ajax( {
        url: `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${speciality}&location=${searchLocation}&sort=distance-asc&skip=0&limit=10&user_key=${apiKey}`,
        type: "GET",
        data: {
          format: 'json'
        },
        success: function(responseObject) {
          resolve(responseObject.data);
        },
        error: function(error) {
          reject("API request for physician specialties failed, our bad");
        }
      });
    });
  }
  function displayDoctors(jsonArray) {
    console.log(jsonArray);
    jsonArray.forEach(function(doctor) {
        $('#outputs').append( `<div class='item'>
                                  <h3>${doctor.profile.first_name} ${doctor.profile.last_name}, ${doctor.profile.title}</h3>
                                  <h4>${doctor.specialties[0].name}</h4>
                                  <img src="${doctor.profile.image_url}" alt='No picture to display'>
                                  <h5>${doctor.profile.bio}</h5>
                              </div>`);

      console.log(doctor);
    });
  }
  function displayDropdown(jsonArray) {
      //split by dashes, join by spaces,
      //uppercase first letter
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
  function getSpeciality() {
      return new Promise( function(resolve, reject) {
      $.ajax( {
        url: `https://api.betterdoctor.com/2016-03-01/specialties?limit=50&user_key=${apiKey}`,
        type: "GET",
        data: {
          format: 'json'
        },
        success: function(responseObject) {
          resolve(responseObject);
        },
        error: function(error) {
          reject("API request for physician specialties failed, our bad");
        }
      });
    });
  }


});

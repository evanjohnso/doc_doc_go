var apiKey = require('./../.env').apiKey;

$(document).ready(function() {
getSpeciality()
  .then(displayDropdown)              //displayDropdown callback function
  .catch(function(errorObject) {      //catch any rejections of promises
    alert(errorObject);
  });
  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    let location = $('input[name="userInputLocation"]').val();
    // let condition = $('input[name="userInputCondition"]').val();
    let specialty = $('select[name="specialty"]').val();
    getLatLon(location, specialty);
    console.log(specialty);
    $('input').val('');
  });

  function getLatLon(location, specialty) {
    return new Promise( function(resolve, reject) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( { address: location }, function(results) {
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      resolve(lat + ',' + lng, specialty);
      reject("Google's geocoder failed, the servers are down. We're all fucked.");
      });
    });
  }

  getLatLon("portland, or")
    .then(getDoctors)
    .catch( function(error) {
      alert(error);
    });

  function getDoctors(searchLocation, speciality) {
    return new Promise( function(resolve, reject) {
      $.ajax( {
        url: `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${speciality}&location=${searchLocation}&sort=distance-asc&skip=0&limit=20&user_key=${apiKey}`,
        type: "GET",
        data: {
          format: 'json'
        },
        success: function(responseObject) {
          console.log('finished promise chain');
          resolve(responseObject);
        },
        error: function(error) {
          reject("API request for physician specialties failed, our bad");
        }
      });
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
        url: `https://api.betterdoctor.com/2016-03-01/specialties?limit=100&user_key=${apiKey}`,
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

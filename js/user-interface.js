var apiKey = require('./../.env').apiKey;

$(document).ready(function() {
getSpeciality()                       //load specialties with document
  .then(displayDropdown)              //displayDropdown callback function
  .catch( function(errorObject) {     //catch any rejections of promises
    alert(errorObject);
  });

  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    let location = $('input[name="userInputLocation"]').val();
    // let condition = $('input[name="userInputCondition"]').val();
    let specialty = $('select[name="specialty"]').val();
    $('#outputs').children().remove(); //clear previous searches
    $('input').val('');
    getLatLon(location, specialty)
      .then(getDoctors)
      .then(displayDoctors)
      .catch( function (error) {
        alert("Sorry, there seems to be an error", error);
      });
  });

  function getLatLon(location, specialty) {
    return new Promise( function(resolve, reject) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode( { address: location }, function(results) {
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      let coordinates = `${lat},${lng},15`; //last parameter is the search radius
      resolve(coordinates, specialty);
      reject("Google's geocoder failed, the servers are down. We're all fucked.");
      });
    });
  }
  function getDoctors(searchLocation, speciality) {
    return new Promise( function(resolve, reject) {
      $.ajax( {
        url: `https://api.betterdoctor.com/2016-03-01/doctors`,
        method: "GET",
        data: {
          speciality_uid: speciality,
          location: searchLocation,
          sort: 'distance-asc',
          skip: 0,
          limit: '15',
          user_key: apiKey
        },
        dataType: 'json',
        success: function(responseObject) {
          let scrubbedInfo = responseObject.data.map( function(doctor) {
            return {
              first: doctor.profile.first_name,
              last: doctor.profile.last_name,
              title: doctor.profile.title,
              speciality: doctor.specialties[0].name,
              picture: doctor.profile.image_url,
              website: doctor.practices.website,
              bio: doctor.profile.bio
            };

          });

          resolve(scrubbedInfo);
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
      let bioString = doctor.bio;
      if (bioString.length > 700) { //if string is too big, find close period and end there
        let endString = indexOf('.', 700);
        bioString = bioString.slice(0, endString);
      }
        $('#outputs').append( `<div class='item'>
                                  <h3>${doctor.first} ${doctor.last}, ${doctor.title}</h3>
                                  <h4>${doctor.speciality}</h4>
                                  <img src="${doctor.picture}" alt='No picture to display'>
                                  <h5>${bioString}</h5>
                              </div>`
                            );

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
        url: `https://api.betterdoctor.com/2016-03-01/specialties`,
        method: "GET",
        data: {
          limit: 50,
          user_key: apiKey,
        },
        dataType: 'json',
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

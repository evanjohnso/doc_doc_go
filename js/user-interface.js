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
        alert("Sorry, there seems to be an error: " + error);
      });
  });

  function getLatLon(location, specialty) {
    return new Promise( function(resolve, reject) {
      try {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode( { address: location }, function(results) {
          if (results.length == 0) {
            throw new Error("Google's geocoder failed, the servers are down. We're all fucked.");
            // reject("Google's geocoder failed, the servers are down. We're all fucked.");
          }
          let lat = results[0].geometry.location.lat();
          let lng = results[0].geometry.location.lng();
          let coordinates = `${lat},${lng},15`;         //last parameter is the search radius
          resolve(coordinates, specialty);
          });
      } catch (e) {
        console.log(e.message);
      }
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
          console.log(responseObject);
          try {
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
          } catch (e) {
            console.log(e.message);
          }

        },
        error: function(error) {
          reject("Request for specific doctors failed, our bad");
        }
      });
    });
  }
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
          reject("Request for medical specialties failed, our bad");
        }
      });
    });
  }


});

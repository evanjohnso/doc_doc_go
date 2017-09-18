var apiKey = require('./../.env').apiKey;

export let DocDoc = {
  getLatLon: (location, specialty) => {
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
  },
  getDoctors: (searchLocation, speciality) => {
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
  },
   getSpeciality: () => {
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
};

const altTags = {
  1:"groups of people gathering, chatting and drinking around tables",
  2:"rounded Marguerita Pizza",
  3:"wood tables and chairs in an empty interior area with metal ceiling",
  4:"exterior of a street corner at night with neon lights" ,
  5:"kitchen open and informal atmosphere where cooks and clients have direct contact",
  6:"old fabric look space with drop-down chairs and tables",
  7:"black and white photograph with the name of the restaurant in stencil",
  8:"tree and facade with the nameof the restaurant in white over blue",
  9:"people sitted to a table eating and interacting with mobile",
  10:"empty espace in cold colors with a metal bar surrounded by white chairs"
}

let favoriteButton;
  /**
   * IndexedDB
   */


function createIndexedDB() {
  //checking for IndexedDB support
  if (!("indexedDB" in window)) {
  console.log("This browser doesn\"t support IndexedDB");
  return;
  }
  //Opening & setting up a database using IndexedDB (name, version, updgradeCallback)
  //and assign it to a promise
  return idb.open('restaurant-reviews-dtbs', 1, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
      //this allows the switch block to execute when the database is first created
      case 1:
      // checks if the objectStore Restaurants already exists, if not, creates one
      if(!upgradeDb.objectStoreNames.contains('restaurants')){
      //assigning the result of createObjectStore (object store object) to a variable to
      //be able to call createIndex on it.
      const restaurantsStore = upgradeDb.createObjectStore('restaurants', {keyPath: 'id'})
      restaurantsStore.createIndex('id', 'id', {unique: true}); 
      }
      case 2:
      // checks if the objectStore reviews already exists, if not, creates one
      if (!upgradeDb.objectStoreNames.contains('reviews')) {
      //assigning the result of createObjectStore (object store object) to a variable to
      //be able to call createIndex on it.
      const reviewsStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id', autoIncrement: true});
      reviewsStore.createIndex('restaurant', 'restaurant_id', {unique: false}); 
      console.log('Creating restaurant_id index on object store reviews');reviewsStore.createIndex('restaurant_id', 'restaurant_id', {unique: false});
      }
    }
  });
}

const dbPromise =createIndexedDB();

class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all restaurants.
   * comments are some extracts of https://developers.google.com/web/ilt/pwa/working-with-indexeddb
   */
  static fetchRestaurants(callback) {
      //calling the database object returned from idb.open to start interactions with the databse
      dbPromise
      // calling .then on dbPromise which resolves to the database object, and pass this object to the callback function in .then
      //when .then executes the database is open and all object stores and indexes are ready for use, because db Promise (idb.open) is a promise
      .then((db) => {
        //opening a transaction on the database object
        const tx = db.transaction('restaurants', 'readwrite');
        //opening object store on transaction
        const restaurantsStore = tx.objectStore('restaurants');
        // returns an IDBRequest object containing all the object in the object store matching the specified prameter
        // or all objects in the store if no parameters are given
        return restaurantsStore.getAll()
      })
      .then((restaurants) => {
        //verifying the existence of restaurants
        if(restaurants.length) {
          callback(null,restaurants) 
        } else {
        //making a Fetch request for the resource needed as a parameter
        fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then((response) => {
          //validates response. It checks 
        if (!response.ok){
            throw Error (response.statusText);
          }
        //reading the response of the request as json // reads the response and returns a promise that resolves to JSON
        return response.json();
        })
      .then((response) => {
          const restaurants = response;
          // matching the altTags to each restaurant by ID
            restaurants.forEach((restaurant,index) => {
              if(restaurant.id) {
                restaurant.alt = altTags[restaurant.id]
                //console.log(restaurant.alt);
    //             const button = document.getElementById('fav-button');  

    //             favoriteButton.onClick = function (){
    // DBHelper.updateFavorites();
    // console.log(favoriteButton.value);
    // debugger;}



              }
           })
          console.log(restaurants);

          //opens Database and updates altTags info to each restaurant with the putMethod
          dbPromise.then((db) => {
              debugger;
              const tx = db.transaction('restaurants', 'readwrite');
              const restaurantsStore = tx.objectStore('restaurants');
              restaurants.forEach(restaurant=>restaurantsStore.put(restaurant))
            })
          callback(null,restaurants);
          })
        }
      })
    }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.

    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`img/${restaurant.id}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 


  static updateFavorite(restaurantID, isFavorite){
    console.log('change value to: ', isFavorite);
    fetch(`${DBHelper.DATABASE_URL}/restaurants/${restaurantID}/?is_favorite=${isFavorite}`, {method: 'PUT'})
        dbPromise
        .then((db) => {
          const tx = db.transaction('restaurants', 'readwrite');
          const restaurantsStore = tx.objectStore('restaurants');
          restaurantsStore.get(restaurantID)
            .then(restaurant => {
              restaurant.is_favorite = isFavorite;
              restaurantsStore.put(restaurant);
            });
        })
  }

}

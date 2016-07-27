/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
 function LocationDataSource() {
  $.extend(this, new storeLocator.StaticDataFeed);

  var that = this;
  var data = 'http://s3.philseven.com/public/p7_stores.csv';
  that.setStores(that.parse_(data));
}

/**
 * @const
 * @type {!storeLocator.FeatureSet}
 * @private
 */
 LocationDataSource.prototype.FEATURES_ = new storeLocator.FeatureSet(
  //new storeLocator.Feature('Wheelchair-YES', 'Wheelchair access'),
  //new storeLocator.Feature('Audio-YES', 'Audio')
  );

/**
 * @return {!storeLocator.FeatureSet}
 */
 LocationDataSource.prototype.getFeatures = function() {
  return this.FEATURES_;
};

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!storeLocator.Store>}
 */
 LocationDataSource.prototype.parse_ = function(csv) {
  var stores = [];
  var config = { "header": true, "skipEmptyLines": true };
  Papa.parse(csv, {
    "header": true, 
    "skipEmptyLines": true,
    "download": true,
    "complete": function(data) {
      for (var i = 0, row; i < data.data.length; i++) {
        row = data.data[i];
        var position = new google.maps.LatLng(row.latitude, row.longitude);
        var shop = join_([row.store_key, row.storename], ': ');
        var locality = join_([row.province_name, row.region_name], ', ');
        var store = new storeLocator.Store(row.store_key, position, null, {
          title: row.storename,
          address: join_([shop, row.address, row.city_muni_name, "Tel: " + row.telno], '<br>'),
          hours: "24h"
        });
        stores.push(store);
      }
    }
  });
  return stores;
  };

/**
 * Joins elements of an array that are non-empty and non-null.
 * @private
 * @param {!Array} arr array of elements to join.
 * @param {string} sep the separator.
 * @return {string}
 */
 LocationDataSource.prototype.join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};

join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};

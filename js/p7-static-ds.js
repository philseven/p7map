/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
function LocationDataSource() {
  $.extend(this, new storeLocator.StaticDataFeed);

  var that = this;
  $.get('../data/p7_stores.csv', function(data) {
    that.setStores(that.parse_(data));
  });
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
  /*var rows = csv.split('\n');*/
  var config = { "header": true, "skipEmptyLines": true };
  var data = Papa.parse(csv, config);

  for (var i = 0, row; i < data.data.length; i++) {
    row = data.data[i];
/*
    var features = new storeLocator.FeatureSet;
    features.add(this.FEATURES_.getById('Wheelchair-' + row.Wheelchair));
    features.add(this.FEATURES_.getById('Audio-' + row.Audio));
*/
    var position = new google.maps.LatLng(row.latitude, row.longitude);

    var shop = this.join_([row.store_key, row.storename], ': ');
    var locality = this.join_([row.province_name, row.region_name], ', ');

    var store = new storeLocator.Store(row.store_key, position, null, {
      title: row.storename,
      address: this.join_([shop, row.address, row.city_muni_name, "Tel: " + row.telno], '<br>'),
      hours: "24h"
    });
    stores.push(store);
  }
  // console.log(stores);
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

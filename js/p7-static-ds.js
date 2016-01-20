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
  new storeLocator.Feature('Wheelchair-YES', 'Wheelchair access'),
  new storeLocator.Feature('Audio-YES', 'Audio')
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
  var data = Papa.parse(csv);
  var headings = data.data[0];
  /*var headings = this.parseRow_(rows[0]);*/

  for (var i = 1, row; row = data.data[i]; i++) {

    /* row = this.toObject_(headings, this.parseRow_(row)); */
    row = this.toObject_(headings, row);
/*
    var features = new storeLocator.FeatureSet;
    features.add(this.FEATURES_.getById('Wheelchair-' + row.Wheelchair));
    features.add(this.FEATURES_.getById('Audio-' + row.Audio));
*/
    var position = new google.maps.LatLng(row.latitude, row.longitude);

    var shop = this.join_([row.store_key, row.storename], ', ');
    var locality = this.join_([row.province_name, row.region_name], ', ');

    var store = new storeLocator.Store(row.store_key, position, "", {
      title: row.storename,
      address: this.join_([shop, row.address, row.city_muni_name], '<br>'),
      hours: "24h"
    });
    stores.push(store);
  }
  console.log(stores);
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

/**
 * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
 * IMPORTANT: Don't use this for general CSV parsing!
 * @private
 * @param {string} row
 * @return {Array.<string>}
 */
LocationDataSource.prototype.parseRow_ = function(row) {
  // Strip leading quote.
  if (row.charAt(0) == '"') {
    row = row.substring(1);
  }
  // Strip trailing quote. There seems to be a character between the last quote
  // and the line ending, hence 2 instead of 1.
  if (row.charAt(row.length - 2) == '"') {
    row = row.substring(0, row.length - 2);
  }

  row = row.split("\t");

  return row;
};

/**
 * Creates an object mapping headings to row elements.
 * @private
 * @param {Array.<string>} headings
 * @param {Array.<string>} row
 * @return {Object}
 */
LocationDataSource.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0, ii = row.length; i < ii; i++) {
    result[headings[i]] = row[i];
  }
  return result;
};

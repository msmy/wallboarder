var mongoose = require('mongoose');

var util = require('util');


WallboardProvider = function() {
  mongoose.connect('mongodb://localhost/node-mongo-wallboarder');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

};

//WallboardProvider.prototype.wallboardSchema = mongoose.Schema({
wallboardSchema = mongoose.Schema({
  title: String,
  url_slug: String,
  created_at: Date,
  elems: [
    {
      id: String,
      tagName: String,
      innerText: String,
      decoration: String,
      decorationStyle: [],
      contentStyle: [],
      headStyle: [],
      style: [],
      struct: {
        rows: []
      },
      tableEditColumns: {
        identifier: [],
        editable: []
      }
    }
  ]
});

WallboardProvider.prototype.wallboard = mongoose.model('wallboards', wallboardSchema);

WallboardProvider.prototype.findOne = function(slug, callback ) {
  this.wallboard.findOne({ 'url_slug': slug }, {}, { sort: { 'created_at' : -1 } }, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.findOneWithDate = function(slug, datetime, callback ) {

  this.wallboard.findOne({ 'url_slug': slug, 'created_at':  datetime}, function (err, result) {
    //console.log(util.inspect(result, false, null));
    if(err) callback(err);
    else callback(null, result)
  });
};

WallboardProvider.prototype.save = function(wallboard, callback) {
  var self = this;

  var wb = new this.wallboard(wallboard);

  wb.created_at = new Date();

  wb.save(function(err, wb) {
    if (err) return console.error(err);
    else {
      callback(null, wb);
    }
  });
};


WallboardProvider.prototype.find = function(slug, callback) {
  this.wallboard.find({ 'url_slug': slug }, {}, { sort: { 'created_at' : -1 }, limit: 50}, function (err, wallboards) {
    if (err) return console.error(err);
    else {
      callback(null, wallboards);
    }
  });

};

exports.WallboardProvider = WallboardProvider;




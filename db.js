
const Datastore = require('nedb');
const db = new Datastore({
  filename: 'highscore.db',
  autoload: true
});

module.exports = {
  insert: (doc, callback = () => {}) => {
    db.insert(doc, (err, newDoc) => {
      db.find({}, (err, docs) => {
        callback(docs);
      });
    });
  },
  getAll: (callback = () => {}) => {
    db.find({}, (err, docs) => {
      callback(docs);
    });
  },
  remove: (callback = () => {}) => {
    db.remove({}, {multi: true}, (err, numRemoved) => {
      callback();
    });
  },
};

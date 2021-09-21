const mongoose = require('mongoose');
// const MongoClient = mongodb.MongoClient;

// let _db;

const mongoConnect = (callback) => { // binadari_app : kN81LbrG4bZgpvoQ
  // mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@binadari.wjkhm.mongodb.net/binadari?retryWrites=true&w=majority`)
  mongoose.connect(`mongodb+srv://binadari_app:kN81LbrG4bZgpvoQ@binadari.wjkhm.mongodb.net/binadari?retryWrites=true&w=majority`)
      .then(client => {
        console.log('Database Connected!');
        // _db = client.db();
        callback();
      })
      .catch(err => {
        console.log('Database Connect Error!');
        console.log(err);
        throw err;
      });
}

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'No database found!'
// }
exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;


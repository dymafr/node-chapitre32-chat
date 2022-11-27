const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://jean:123@cluster0-urpjt.gcp.mongodb.net/nodechapitre32?retryWrites=true'
  )
  .then(() => {
    console.log('connexion ok !');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;

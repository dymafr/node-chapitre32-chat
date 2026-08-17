const { Room } = require('./models');
const { Namespace } = require('./models');
const mongoose = require('mongoose');

// L'URL de connexion contient un identifiant et un mot de passe : elle n'a
// rien à faire dans le code. Nous la lisons dans l'environnement.
const MONGO_URL = process.env.MONGO_URL;

const NAMESPACES = [
  '/images/angular.png',
  '/images/vue.png',
  '/images/react.png',
];

const TITRES_DE_ROOMS = ['Général', 'Hors sujet'];

const seed = async () => {
  await mongoose.connect(MONGO_URL);
  console.log('connexion ok !');

  for (const imgUrl of NAMESPACES) {
    const namespace = await new Namespace({ imgUrl }).save();
    console.log(`namespace ${imgUrl} créé`);

    await Promise.all(
      TITRES_DE_ROOMS.map((title, index) =>
        new Room({ namespace: namespace._id, index, title }).save()
      )
    );
    console.log(`rooms de ${imgUrl} créées`);
  }
};

// Sans la déconnexion, le processus reste en vie indéfiniment : une connexion
// Mongoose ouverte suffit à retenir la boucle d'événements.
seed()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

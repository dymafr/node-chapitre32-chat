const { Namespace, Room } = require('./models');
const mongoose = require('mongoose');

mongoose
  .connect('VOTRE DB')
  .then(() => {
    console.log('connexion ok !');

    const ns1 = new Namespace({
      imgUrl: '/images/angular.png',
    });

    const ns2 = new Namespace({
      imgUrl: '/images/vue.png',
    });

    const ns3 = new Namespace({
      imgUrl: '/images/react.png',
    });

    ns1
      .save()
      .then((namespace) => {
        console.log('ns1 created');
        const room1 = new Room({
          namespace: namespace._id,
          index: 0,
          title: 'Général',
        });
        const room2 = new Room({
          namespace: namespace._id,
          index: 1,
          title: 'Hors sujet',
        });
        Promise.all([room1.save(), room2.save()]).then(() => {
          console.log("ns1's room created");
        });
      })
      .catch((err) => {
        console.error(err);
      });

    ns2.save().then((namespace) => {
      console.log('ns2 created');
      const room1 = new Room({
        namespace: namespace._id,
        index: 0,
        title: 'Général',
      });
      const room2 = new Room({
        namespace: namespace._id,
        index: 1,
        title: 'Hors sujet',
      });
      Promise.all([room1.save(), room2.save()]).then(() => {
        console.log("ns2's room created");
      });
    });

    ns3.save().then((namespace) => {
      console.log('ns3 created');
      const room1 = new Room({
        namespace: namespace._id,
        index: 0,
        title: 'Général',
      });
      const room2 = new Room({
        namespace: namespace._id,
        index: 1,
        title: 'Hors sujet',
      });
      Promise.all([room1.save(), room2.save()]).then(() => {
        console.log("ns3's room created");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

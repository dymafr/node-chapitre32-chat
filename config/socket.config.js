const { Server } = require("socket.io");
const { server } = require("../app");
const { ensureAuthenticatedOnSocketHandshake } = require("./security.config");
const { getNamespaces } = require("../queries/namespace.queries");
const { findRoomPerNamespaceId } = require("../queries/room.queries");
const {
  findMessagesPerRoomId,
  createMessage,
} = require("../queries/message.queries");
let ios;
let namespaces;

const initNamespaces = async () => {
  namespaces = await getNamespaces();
  for (let namespace of namespaces) {
    const ns = ios.of(`/${namespace._id}`);
    ns.on("connect", async (nsSocket) => {
      try {
        const rooms = await findRoomPerNamespaceId(namespace._id);
        nsSocket.emit("rooms", rooms);
      } catch (e) {
        // Jamais throw dans le rappel d'un événement : personne n'attend
        // cette promesse, et un rejet non rattrapé arrête le processus Node.
        console.error(e);
      }
      nsSocket.on("joinRoom", async (roomId) => {
        try {
          // Le client envoie ce qu'il veut : nous vérifions que la room
          // existe et qu'elle appartient bien à ce namespace, sinon
          // n'importe qui pourrait lire les messages de n'importe quel salon.
          const rooms = await findRoomPerNamespaceId(namespace._id);
          const room = rooms.find((r) => r._id.toString() === String(roomId));
          if (!room) {
            return;
          }
          nsSocket.join(`/${room._id}`);
          const messages = await findMessagesPerRoomId(room._id);
          nsSocket.emit("history", messages);
        } catch (e) {
          console.error(e);
        }
      });
      nsSocket.on("leaveRoom", (roomId) => {
        nsSocket.leave(`/${roomId}`);
      });
      nsSocket.on("message", async ({ text, roomId } = {}) => {
        try {
          // Le texte vient du client : nous refusons ce qui n'est pas une
          // chaîne, ce qui est vide, et ce qui est déraisonnablement long.
          if (typeof text !== "string") {
            return;
          }
          const contenu = text.trim();
          if (!contenu || contenu.length > 2000) {
            return;
          }
          // Nous n'écrivons que dans une room que la socket a rejointe :
          // sans ce test, un client peut poster dans n'importe quel salon.
          if (!nsSocket.rooms.has(`/${roomId}`)) {
            return;
          }
          const { _id, username } = nsSocket.request.user;
          const message = await createMessage({
            data: contenu,
            room: roomId,
            author: _id,
            authorName: username,
          });
          ns.to(`/${roomId}`).emit("message", message);
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
};

const initSocketServer = () => {
  ios = new Server(server, {
    allowRequest: ensureAuthenticatedOnSocketHandshake,
  });
  ios.on("connect", (socket) => {
    console.log("connexion ios ok");
    socket.emit("namespaces", namespaces);

    // L'écouteur va sur la socket, et non sur le serveur : le message vient
    // d'un client. Posé sur le serveur, il ne se déclencherait jamais, et la
    // déconnexion resterait sans effet.
    socket.on("close", () => {
      socket.disconnect(true);
    });
  });

  // initNamespaces est asynchrone : sans rattrapage, la moindre erreur de
  // base de données au démarrage arrêterait le processus.
  initNamespaces().catch((e) => console.error(e));
};

initSocketServer();

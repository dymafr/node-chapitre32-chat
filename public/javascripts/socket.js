let namespaces;
let namespaceSockets = [];
let rooms = [];
let init = false;
let activeNsSocket;
// firstRoom était affectée sans être déclarée : elle devenait une
// variable globale implicite, ce qui lève une ReferenceError en mode strict.
let firstRoom;
let activeRoom;
let messages = [];

const ioClient = io({
  reconnection: false,
});

ioClient.on("connect", () => {
  console.log("connexion ok !");
});

ioClient.on("namespaces", (data) => {
  namespaces = data;
  for (let ns of namespaces) {
    const nsSocket = io(`/${ns._id}`);
    nsSocket.on("rooms", (data) => {
      rooms.push(...data);
      if (!init) {
        init = true;
        activateNamespace(nsSocket);
        displayNamespaces(namespaces, nsSocket.nsp);
      }
    });
    nsSocket.on("history", (data) => {
      messages = data;
      displayMessages(messages);
    });
    nsSocket.on("message", (data) => {
      messages.push(data);
      displayMessages(messages);
    });
    namespaceSockets.push(nsSocket);
  }
});

function activateRoom(room) {
  activeNsSocket.emit("joinRoom", room._id);
  activeRoom = room;
}

function activateNamespace(nsSocket) {
  activeNsSocket = nsSocket;
  firstRoom = rooms.find(
    (room) => `/${room.namespace}` === activeNsSocket.nsp && room.index === 0
  );
  // Un namespace sans room est possible : il ne faut pas continuer comme si
  // firstRoom existait toujours.
  if (!firstRoom) {
    return;
  }
  activateRoom(firstRoom);
  displayRooms(
    rooms.filter((room) => `/${room.namespace}` === activeNsSocket.nsp),
    firstRoom._id
  );
}

let namespaces;
let namespaceSockets = [];
let rooms = [];
let init = false;
let activeNsSocket;
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
  activateRoom(firstRoom);
  displayRooms(
    rooms.filter((room) => `/${room.namespace}` === activeNsSocket.nsp),
    firstRoom._id
  );
}

setTimeout(() => {
  console.log({
    namespaces,
    namespaceSockets,
    rooms,
    activeNsSocket,
    activeRoom,
    messages,
  });
}, 3000);

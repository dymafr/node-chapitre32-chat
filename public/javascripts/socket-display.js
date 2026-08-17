function createNamespaceItem(namespace, isActive) {
  const li = document.createElement('li');
  li.classList.add('item-namespace', 'p-2', 'm-2');
  if (isActive) {
    li.classList.add('active');
  }
  // Nous construisons l'image plutôt que d'écrire du HTML dans une chaîne :
  // l'adresse vient de la base de données, et une chaîne bien choisie y
  // ferait exécuter du JavaScript.
  const img = document.createElement('img');
  img.src = namespace.imgUrl;
  img.alt = '';
  li.append(img);
  li.addEventListener('click', () => {
    if (activeNsSocket.nsp !== `/${namespace._id}`) {
      activeNsSocket.emit('leaveRoom', activeRoom._id);
      const ns = namespaceSockets.find((ns) => ns.nsp === `/${namespace._id}`);
      activateNamespace(ns);
      displayNamespaces(namespaces, ns.nsp);
    }
  });
  return li;
}

function displayNamespaces(namespaces, activeNsp) {
  const namespacesContainer = document.querySelector('.list-namespaces');
  const items = namespaces.map((namespace) =>
    createNamespaceItem(namespace, activeNsp === `/${namespace._id}`)
  );
  namespacesContainer.innerHTML = '';
  namespacesContainer.prepend(...items);
}

function createRoomItem(room, isActive) {
  const li = document.createElement('li');
  li.classList.add('item-room', 'p-2', 'm-2');
  if (isActive) {
    li.classList.add('active');
  }
  // textContent, et non innerHTML : le titre vient de la base de données.
  li.textContent = `# ${room.title}`;
  li.addEventListener('click', () => {
    if (activeRoom._id !== room._id) {
      activeNsSocket.emit('leaveRoom', activeRoom._id);
      activateRoom(room);
      displayRooms(
        rooms.filter((room) => `/${room.namespace}` === activeNsSocket.nsp),
        room._id
      );
    }
  });
  return li;
}

function displayRooms(rooms, activeRoomId) {
  const roomsContainer = document.querySelector('.list-rooms');
  const items = rooms.map((room) =>
    createRoomItem(room, activeRoomId === room._id)
  );
  roomsContainer.innerHTML = '';
  roomsContainer.prepend(...items);
}

function createMessageItem(message) {
  const li = document.createElement('li');
  li.classList.add('item-message', 'd-flex', 'flex-row', 'mb-2');

  // Attention : le contenu d'un message est écrit par un utilisateur. Le
  // passer à innerHTML revient à laisser n'importe qui exécuter du JavaScript
  // dans le navigateur de tous les autres. C'est la faille la plus courante
  // dans un chat, et elle se referme en construisant les éléments.
  const heure = document.createElement('span');
  heure.classList.add('me-1');
  heure.textContent = message.time;

  const auteur = document.createElement('strong');
  auteur.classList.add('me-3');
  auteur.textContent = message.authorName;

  const texte = document.createElement('span');
  texte.classList.add('flex-fill');
  texte.textContent = message.data;

  li.append(heure, auteur, texte);
  return li;
}

function displayMessages(messages) {
  const messagesContainer = document.querySelector('.list-messages');
  const items = messages.map((message) =>
    createMessageItem({
      ...message,
      time: new Date(message.updatedAt).toLocaleTimeString(),
    })
  );
  messagesContainer.innerHTML = '';
  messagesContainer.prepend(...items);
  if (items.length) {
    items[items.length - 1].scrollIntoView();
  }
}

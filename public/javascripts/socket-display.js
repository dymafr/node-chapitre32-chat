function createNamespaceItem(namespace, isActive) {
  const li = document.createElement('li');
  li.classList.add('item-namespace', 'p-2', 'm-2');
  if (isActive) {
    li.classList.add('active');
  }
  li.innerHTML = `
    <img src="${namespace.imgUrl}" />
  `;
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
  li.innerHTML = `
    # ${room.title}
  `;
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
  li.innerHTML = `
    <span class="me-1">${message.time}</span>
    <strong class="me-3">${message.authorName}</strong>
    <span class="flex-fill">${message.data}</span>
  `;
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

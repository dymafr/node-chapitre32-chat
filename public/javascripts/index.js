window.addEventListener('DOMContentLoaded', () => {
  const logout = document.querySelector('#logout');

  if (!logout) return;

  logout.addEventListener('click', () => {
    ioClient.emit('close');
    location.assign('/auth/signout');
  });
});

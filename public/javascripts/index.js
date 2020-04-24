window.addEventListener("DOMContentLoaded", () => {
  const logout = document.querySelector("#logout");

  logout.addEventListener("click", () => {
    ioClient.emit("close");
    location.assign("/auth/signout");
  });
});

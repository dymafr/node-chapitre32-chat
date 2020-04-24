window.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  const btn = document.querySelector("button");
  input.focus();

  function submitMessage() {
    const value = input.value;
    if (value) {
      activeNsSocket.emit("message", { text: value, roomId: activeRoom._id });
      input.value = "";
      input.focus();
    }
  }

  btn.addEventListener("click", submitMessage);

  input.addEventListener("keyup", (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      submitMessage();
    }
  });
});

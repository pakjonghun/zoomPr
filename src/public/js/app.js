const socket = new WebSocket(`ws://${window.location.host}`);

const message = document.getElementById("message");
const nickName = document.getElementById("nickName");
const ul = document.querySelector("ul");

const readyToSend = (type, data) => JSON.stringify({ type, data });

nickName.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickName.querySelector("input");

  const data = readyToSend("nickName", input.value);
  socket.send(data);
});

message.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = message.querySelector("input").value;
  const data = readyToSend("message", input);
  socket.send(data);
});

socket.addEventListener("open", () => {
  // console.log("he");
});

socket.addEventListener("message", (ev) => {
  const data = JSON.parse(ev.data);
  if (data.type === "message") {
    const li = document.createElement("li");
    li.innerText = ` ${data.nickName} me:${data.data}`;
    ul.prepend(li);
  }
});

socket.addEventListener("close", (th) => {
  // console.log("closed");
  // console.log(th);
});

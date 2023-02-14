const http = require("http");
const app = require("./config/express.js");
const { Server } = require("socket.io");
const { host, port } = require("./config/vars");

// Server configuration and build
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User #${socket.id} is connected `);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User #${socket.id} joined room#${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log(`#${socket.id} disconnected`);
  });
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server running at http://${host}:${port}`);
});

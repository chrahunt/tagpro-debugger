(function() {

chrome.runtime.onConnectExternal.addListener(function connectListener(port) {
  console.log("Received port connection: ", port);
  var socket, messenger;
  console.assert(port.name == "init");
  messenger = new Messenger(port);

  messenger.on("init_socket", function(data) {
    socket = io.connect(data.location, {
      reconnect: false
    });
    connected = true;
  });

  // Add a listener to the socket.
  messenger.on("add_listener_socket", function(data) {
    var name = data.name;
    socket.on(name, function() {
      var msg = {
        args: Array.prototype.slice.call(arguments)
      };
      messenger.emit("socket:" + name, msg);
    });
  });

  // Handle message being emitted to the socket.
  messenger.on("emit_socket", function(msg) {
    var data = msg.arg;
    var name = msg.name;
    socket.emit(name, data);
  });

  // Listen for socket disconnection.
  messenger.onDisconnect(function() {
    console.log("Disconnecting.");
    socket.disconnect();
    connected = false;
    // Reload extension page.
    location.reload();
  });
});

})();

/**
 * Methods for setting chrome message listeners. Objects being passed
 * by methods in this library have the corresponding message name
 * stored in the `method` property of the message object.
 */
(function(window) {

  var Messenger = function(port) {
    this.names = {};
    this.connected = true;
    this.port = port;
    this.port.onMessage.addListener(function portListener(msg) {
      var name = msg._msg_name;
      delete msg._msg_name;
      if (this.names.hasOwnProperty(name)) {
        this.names[name].forEach(function(fn) {
          fn(msg);
        });
      }
    }.bind(this));
    this.port.onDisconnect.addListener(function() {
      this.connected = false;
    }.bind(this));
  };
  window.Messenger = Messenger;

  Messenger.prototype.on = function(name, callback) {
    if (!this.names.hasOwnProperty(name)) {
      this.names[name] = [];
    }
    this.names[name].push(callback);
  };

  Messenger.prototype.onDisconnect = function(callback) {
    this.port.onDisconnect.addListener(callback);
  };

  Messenger.prototype.off = function(name, callback) {
    if (!this.names.hasOwnProperty(name)) return;
    var i = this.names[name].indexOf(callback);
    this.names[name].splice(i, 1);
  };

  Messenger.prototype.emit = function(name, data) {
    if (!this.connected) return;
    data._msg_name = name;
    this.port.postMessage(data);
  };
})(window);

(function(window) {

// Id of extension.
var extensionId = "bgdehmapniobaanndiphlnabdbocnakk";
var messenger;
var debug = true;

function log() {
  if (debug) {
    console.log.apply(console, arguments);
  }
}

log("TagPro Debugger Injected!");
// Overwrite socket.
function socketOverwrite() {
  console.assert(tagpro.socket === null);
  log("Overwriting socket.");
  var createSocket = tagpro.createSocket;
  tagpro.createSocket = function() {
    log("createSocket has been called.");
    // Initialize socket on background page.
    messenger.emit("init_socket", {
      location: tagpro.gameSocket || document.location.href + '?r=' + Math.round(Math.random() * 10000000)
    });

    tagpro.rawSocket = {
      io: {
        engine: {
          transport: {
            polling: false
          }
        }
      }
    };
    // TODO: rawSocket sync.
    // Only for updating polling right now.
    /*messenger.on("update_raw_socket", function(msg) {
      var update = msg.update;
    });*/
    
    return {
      // Recieve socket message from background page.
      on: function(name, callback) {
        // Inform background page of listener to be added.
        messenger.emit("add_listener_socket", { name: name });
        // Handle forwarded packet from background page.
        messenger.on("socket:" + name, function(data) {
          var args = data.args;
          try {
            callback.apply(null, args);
          } catch (err) {
            console.error('Unhandled socket.io on(' + name + ') error. Mod makers, handle your errors!');
            console.error(err);
            console.error(JSON.stringify(args));
          }
        });
      },
      emit: function(name, data) {
        var msg = {
          name: name,
          arg: data
        };
        messenger.emit("emit_socket", msg);
      }
    };
  };
}

function checkForTagpro(fn) {
  if (typeof tagpro !== "undefined") {
    fn();
  } else {
    setTimeout(function repeater() {
      checkForTagpro(fn);
    }, 10);
  }
}

// Try to use page-to-extension messaging with fallback to 
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.connect) {
  checkForTagpro(function main() {
    // Check that functions haven't been run.
    if (document.readyState !== "complete") {
      tagpro._readyCallbacks.unshift(socketOverwrite);
    } else {
      console.error("Debugger initialized too late.");
    }
  });

  var port = chrome.runtime.connect(extensionId, {
    name: "init"
  });

  messenger = new Messenger(port);
} else {
  console.error("Chrome functions not found!");
}
})(window);

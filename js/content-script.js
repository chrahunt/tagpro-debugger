// Remove self.
function removeScript() {
  this.parentNode.removeChild(this);
}

// Inject require.js into page and set data-main to path.
function injectScript(path) {
  var script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.src = chrome.extension.getURL(path);
   script.onload = removeScript;
  (document.head||document.documentElement).appendChild(script);
}

// If we're in a game, as evidenced by there being a port number, inject the scripts.
if(document.URL.search(/\.\w+:/) >= 0) {
  var scripts = [
    "js/messenger.js",
    "js/injected-script.js"
  ];
  scripts.forEach(injectScript);
}

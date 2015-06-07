# TagPro Debugger

Allows for the easier use of debugging tools during a game by moving the responsibility for socket communication to the background page of the extension. This causes a lot of lag (around +400 ping) and some loss, but you won't be kicked from the game for setting a breakpoint in your code because the socket ping message which needs to be sent every 2s is taken care of on the background page.

Make sure to change the `extensionId` in `injected-script.js` to match the id received when the extension is loaded as an unpacked extension.



import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "local", // matches PUSHER_APP_KEY
  cluster: "mt1",
  wsHost: window.location.hostname,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  // enabledTransports: ["ws"],
});

export default echo;


import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher globally available
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "ayana", // <- Replace this with your actual Pusher app key
  cluster: "ayana",             // <- Replace with your Pusher cluster (e.g., 'mt1')
  forceTLS: false,
  wsHost: window.location.hostname,
  wsPort: 6001,
  disableStats: true,
});



echo.channel('manager-status')
    .listen('.ManagerActivated', (event) => {
        console.log('MANAGER: You have been activated!', event.username);
        // Redirect, show message, or update UI
    });

export default echo;

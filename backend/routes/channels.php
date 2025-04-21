<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('admin-activation-channel', function () {
    return true; // ✅ anyone can listen (you can customize for auth if needed)
});
Broadcast::channel('traffic-activations', function () {
    return true; // or use authorization logic
});

Broadcast::channel('traffic-activation-status', function () {
    return true;
});

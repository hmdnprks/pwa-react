import { urlBase64ToUint8Array } from "../../utils";

export function configurePushSub() {
  if(!('serviceWorker' in navigator)) {
    return;
  }
  var reg;
  navigator.serviceWorker.ready
    .then(function(sw) {
      reg = sw;
      return sw.pushManager.getSubscription()
    })
    .then(function(sub) {
      if(sub === null){
        var vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
        var convertedVpk = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVpk
        });
      }
    })
    .then(function(newSub) {
      return fetch(process.env.REACT_APP_FIREBASE_DATABASE_URL + '/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(function(res) {
      if(res.ok){
        displayConfirmNotification();
      }
    })
    .catch(function(err) {
      console.log('err :>> ', err);
    })
}

function displayConfirmNotification(){
  var title = 'Sucessfully subscribed';
  var options = {
    body: 'You successfully subscribed to our Notification service',
    icon:  process.env.PUBLIC_URL + 'icons/icon-96x96.png',
    image: process.env.PUBLIC_URL + 'woman.jpeg',
    dir: 'ltr',
    lang: 'en-US',
    vibrate: [100, 50, 200],
    badge: process.env.PUBLIC_URL + 'icons/icon-96x96.png',
    tag: 'confirm-notification',
    renotify: true,
    actions: [
      { action: 'confirm', title: 'Okay', icon: process.env.PUBLIC_URL + 'icons/icon-96x96.png' },
      { action: 'cancel', title: 'Cancel', icon: process.env.PUBLIC_URL + 'icons/icon-96x96.png' }
    ]
  }
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready
      .then(function(sw){
        sw.showNotification(title, options);
      })
  }
  // new Notification(title, options);
}
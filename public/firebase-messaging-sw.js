importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function () {
        clients.openWindow("/app/password-request");
      })
  );
});

// HAICA Cloud
// apiKey: "AIzaSyByxCIBqK5157eBQ_97Qz7urCQEHaIgYU4",
// authDomain: "wellfeet-4d487.firebaseapp.com",
// projectId: "wellfeet-4d487",
// storageBucket: "wellfeet-4d487.appspot.com",
// messagingSenderId: "1027667322106",
// appId: "1:1027667322106:web:bcf0bcec263bb36e7c9543",
// measurementId: "G-V42810CCFF",

// Staging
// apiKey: "AIzaSyAAfvR3sXGDB6JUTfuzNEfTEwvtgCK8i80",
// authDomain: "wellfeet-stg.firebaseapp.com",
// projectId: "wellfeet-stg",
// storageBucket: "wellfeet-stg.appspot.com",
// messagingSenderId: "586838955951",
// appId: "1:586838955951:web:42603a2d8cd263e812415a",
// measurementId: "G-GBEQ9SZT24"

// Prod
// apiKey: "AIzaSyBUZ0UCpGxx-ByqN8VkD70Am8DAL-w5eFg",
// authDomain: "gcp-lkc-wellfeet-2efe.firebaseapp.com",
// projectId: "gcp-lkc-wellfeet-2efe",
// storageBucket: "gcp-lkc-wellfeet-2efe.appspot.com",
// messagingSenderId: "463670615654",
// appId: "1:463670615654:web:438e97a9d730262c8717a7",

firebase.initializeApp({
  apiKey: "AIzaSyA_wbfQyOXKbdzlKQd51SxoHoD74GovuOI",
  authDomain: "novo-67e2a.firebaseapp.com",
  projectId: "novo-67e2a",
  storageBucket: "novo-67e2a.appspot.com",
  messagingSenderId: "101606730812",
  appId: "1:101606730812:web:2c86be66450c5948d9a739",
  measurementId: "G-P5DXDXJPXE",
});

const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;

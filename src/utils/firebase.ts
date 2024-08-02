import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import http from "./http";

export const initializeFirebaseApp = async () => {
  const vapidKey = process.env.REACT_APP_FCM_KEY;
  const messaging = await isSupported()
    .then((support) => {
      if (support) {
        return getMessaging();
      } else {
        return false;
      }
    })
    .catch(() => {
      return null;
    });
  if (!vapidKey || !messaging) {
    return;
  }

  getToken(messaging, { vapidKey: vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        const registeredToken = localStorage.getItem("wellfeet_fcm_token");
        if (currentToken !== registeredToken) {
          localStorage.setItem("sm_fcm_token", currentToken);
          http
            .post(`/users/notification-token`, {
              nToken: currentToken,
            })
            .then(() => {
              // console.log("updated");
            })
            .catch((err) => console.log(err));
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
  onMessage(messaging, (payload: any) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(payload?.notification?.title, {
          body: payload?.notification?.body,
        });
        notification.onclick = (event) => {
          event.preventDefault();
          window.open("/app/password-request", "_blank");
        };
      } else if (
        "Notification" in window &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            const notification = new Notification(
              payload?.notification?.title,
              {
                body: payload?.notification?.body,
              }
            );
            notification.onclick = (event) => {
              event.preventDefault();
              window.open("/app/password-request", "_blank");
            };
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};

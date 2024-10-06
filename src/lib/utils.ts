import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import PusherClient from "pusher-js";
import PusherServer from "pusher";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractUUIDFromString = (url: string) => {
  return url.match(
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
  );
};

export const extractEmailsFromString = (text: string) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

// WIP uncomment the pusher server and pusher client
export const pusherServer = {};
// new PusherServer({
//   appId: process.env.PUSHER_APP_ID as string,
//   key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
//   secret: process.env.PUSHER_APP_SECRET as string,
//   cluster: "mt1",
//   useTLS: true,
// });

export const pusherClient = {};
// new PusherClient(
//   process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
//   {
//     cluster: "mt1",
//   }
// );

export const postToParent = (message: string) => {
  window.parent.postMessage(message, "*");
};

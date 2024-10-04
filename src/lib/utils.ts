import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import PusherClient from "pusher-js";
import PusherServer from "pusher";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: "mt1",
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  {
    cluster: "mt1",
  }
);

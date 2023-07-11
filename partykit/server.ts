//  <reference no-default-lib="true"/>
// <reference types="@cloudflare/workers-types" />

import { onConnect } from "y-partykit";

const config = {
  async onConnect(
    ws: WebSocket,
    room: string,
    unstable_initial: { level: string }
  ) {
    let tmp = ws.addEventListener;
    ws.addEventListener = (type: string, callback) => {
      if (type == "message" && unstable_initial.level == "VIEWER") {
        return;
      } else {
        return tmp(type, callback);
      }
    };
    return onConnect(ws, room, { persist: true });
  },
  async onBeforeConnect(req, room) {
    // - onBeforeConnect runs in a separate worker, so we can't use
    //   any shared in-memory state betweex`n `onBefore*` and `on*` methods.
    // - Throwing an error in this callback will lead to a rejected connection.
    const token = new URL(req.url).searchParams.get("token");

    const asdf = await fetch(
      "nijika.jcde.xyz/api/ws-auth",
      // "http://localhost:3000/api/ws-auth",

      {
        method: "POST",
        headers: {
          auth: "2dJgubVWpb4R8X8d2bFo9hSXoqDhS38gTJ36vBghQPiTVBXQyB3uKcCLHmDe9iEtj4C2aR7kYWiLxaieziL2XQdLx8GQrTGjnjYXDDBp8NLirGyuhDa8xwS6XHXdoEn9",
          // room.env.WSAUTH_SECRET
        },
        body: JSON.stringify({ check: token, room: room.id }),
      }
    );
    const { level } = await asdf.json();
    console.log(asdf);
    if (asdf.ok) {
      return { level };
    } else {
      throw new Error("Unauthorized");
    }
  },
};
export default config;

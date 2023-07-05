//  <reference no-default-lib="true"/>
// <reference types="@cloudflare/workers-types" />

import { jwtDecrypt } from "jose";
import { onConnect } from "y-partykit";

const config = {
  async onConnect(ws, room) {
    return onConnect(ws, room, { persist: true });
  },
  async onBeforeConnect(req, room) {
    // - onBeforeConnect runs in a separate worker, so we can't use
    //   any shared in-memory state between `onBefore*` and `on*` methods.
    // - Throwing an error in this callback will lead to a rejected connection.
    const token = new URL(req.url).searchParams.get("token");

    const asdf = await fetch("https://nijika.jcde.xyz/api/ws-auth", {
      method: "POST",
      headers: { auth: room.env.WSAUTH_SECRET },
      body: JSON.stringify({ check: token }),
    });

    if (asdf.ok) {
      return;
    } else {
      throw new Error("Unauthorized");
    }
  },
};
export default config;

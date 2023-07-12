import { onConnect } from "@iojcde/y-partykit";

export type PartyKitConnection = WebSocket & {
  id: string;
  /**
   * @deprecated
   */
  socket: WebSocket;
  unstable_initial: { level: string };
};

const config = {
  async onConnect(ws: PartyKitConnection, room: string) {
    const { unstable_initial } = ws;

    return onConnect(ws, room, {
      persist: true,
      readOnly: unstable_initial.level == "VIEWER",
    });
  },
  async onBeforeConnect(req, room) {
    // - onBeforeConnect runs in a separate worker, so we can't use
    //   any shared in-memory state betweex`n `onBefore*` and `on*` methods.
    // - Throwing an error in this callback will lead to a rejected connection.
    const token = new URL(req.url).searchParams.get("token");

    const asdf = await fetch(
      "https://nijika.jcde.xyz/api/ws-auth",
      // "http://localhost:3000/api/ws-auth",

      {
        method: "POST",
        headers: {
          auth: room.env.WSAUTH_SECRET,
        },
        body: JSON.stringify({ check: token, room: room.id }),
      }
    );

    const res = await asdf.json();
    console.log(res);

    if (asdf.ok) {
      return { level: res.level };
    } else {
      // throw new Error("Unauthorized");
    }
  },
};
export default config;

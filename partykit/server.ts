// import { YPartyKitOptions, onConnect } from "@iojcde/y-partykit"

// import type { PartyKitServer } from "partykit/server"
// // import { AccessLevel } from "@prisma/client"
// import { yXmlFragmentToProsemirrorJSON } from "y-prosemirror"

// const config = {
//   async onConnect(ws, room) {
//     const { unstable_initial } = ws
//     const headers = new Headers()
//     headers.append("auth", room.env.WSAUTH_SECRET as string)

//     return onConnect(ws, room, {
//       persist: true,
//       readOnly: (unstable_initial as { level: AccessLevel }).level == "VIEWER",
//       callback: {
//         handler: async (doc) => {
//           const data = doc.getXmlFragment("prosemirror")
//           fetch("https://kaiwa.jcde.xyz/api/ws-callback", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               auth: room.env.WSAUTH_SECRET as string,
             
//             },
//             body: JSON.stringify({
//               data: yXmlFragmentToProsemirrorJSON(data),
//               room: room.id,
//             }),
//           })
//         },
//       },
//     })
//   },
//   async onBeforeConnect(req, room) {
//     // - onBeforeConnect runs in a separate worker, so we can't use
//     //   any shared in-memory state betweex`n `onBefore*` and `on*` methods.
//     // - Throwing an error in this callback will lead to a rejected connection.
//     const token = new URL(req.url).searchParams.get("token")

//     const asdf = await fetch(
//       "https://kaiwa.jcde.xyz/api/ws-auth",
//       // "http://localhost:3000/api/ws-auth",

//       {
//         method: "POST",
//         headers: {
//           auth: room.env.WSAUTH_SECRET as string,
//         },
//         body: JSON.stringify({ check: token, room: room.id }),
//       }
//     )

//     const res = await asdf.json()

//     if (asdf.ok) {
//       return { level: res.level }
//     } else {
//       // throw new Error("Unauthorized");
//     }
//   },
// } satisfies PartyKitServer
// export default config

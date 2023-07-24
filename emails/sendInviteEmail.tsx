import { resend } from "./resend" 
import InviteEmail, { InviteEmailProps } from "./inviteEmail"
 

export const sendInviteEmail = async (props:InviteEmailProps) => {
  try {
    await resend.emails.send({
      from: "Kaiwa <noreply@kaiwa.jcde.xyz>",
      to: props.user.email,
      subject: `Document shared with you: "${props.postName}"`,
      react: InviteEmail(props),
    })
  } catch (error) {
    console.log({ error })
  }
}

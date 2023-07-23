import { SendVerificationRequestParams } from "next-auth/providers"
import { resend } from "./resend"
import { VerificationEmail } from "./verificationEmail"
export const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  try {
    await resend.emails.send({
      from: "Kaiwa <auth@kaiwa.jcde.xyz>",
      to: params.identifier,
      subject: "Your magic link to sign in to Kaiwa",
      react: VerificationEmail({ url: params.url }),
    })
  } catch (error) {
    console.log({ error })
  }
}

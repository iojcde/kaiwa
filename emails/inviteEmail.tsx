import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import * as React from "react"
export type InviteEmailProps = {
  postName: string
  user: {
    name?: string
    email: string
  }
  invitedBy: {
    name?: string
    email: string
  }
}

export const InviteEmail = ({
  postName,
  user: { name, email },
  invitedBy: { name: invitedBy, email: invitedByEmail },
}: InviteEmailProps) => (
  <Html>
    <Head />
    <Preview>The Document {postName} has been shared with you</Preview>
    <Tailwind>
      <Body className=" bg-white font-sans">
        <Container className="mx-auto mb-[40px] max-w-2xl p-[20px]">
          <Heading as="h1" className="text-3xl">
            Edit {postName} on Kaiwa
          </Heading>
          <Text className="text-base leading-[16px]">
            Hello {name ?? email},
          </Text>
          <Text className="text-base">
            {invitedBy} ({invitedByEmail}) has invited you to edit the document{" "}
            {postName} on Kaiwa.
          </Text>

          <Button
            pX={20}
            pY={12}
            className="rounded-lg bg-[#000000] font-semibold text-white no-underline"
            href={`https://kaiwa.jcde.xyz/login`}
          >
            Open
          </Button>
        </Container>
        <Hr />
      </Body>
    </Tailwind>
  </Html>
)
export default InviteEmail

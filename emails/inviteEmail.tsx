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

export const InviteEmail = (postName, { name, email }) => (
  <Html>
    <Head />
    <Preview>Join {postName} on Kaiwa</Preview>

    <Tailwind>
      <Body className="mx-auto bg-white font-sans">
        <Container className="mx-auto mb-[40px] max-w-2xl p-[20px]">
          <Heading>Edit {postName} in Kaiwa</Heading>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

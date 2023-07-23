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

export const VerificationEmail = ({ url }) => {
  const previewText = `Hello, Here's your magic link to sign in to Kaiwa.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto bg-white font-sans">
          <Container className="mx-auto mb-[40px] max-w-2xl p-[20px]">
            <Text className="text-lg font-medium">Kaiwa</Text>

            <Heading as="h1" className="text-3xl">
              Your magic link
            </Heading>
            <Text className="text-base leading-[16px]"> Hello,</Text>
            <Text className="text-base">
              Here&apos;s your magic link to sign in to Kaiwa.
            </Text>

            <Button
              pX={20}
              pY={12}
              className="rounded-lg bg-[#000000] font-semibold text-white no-underline"
              href={url}
            >
              Login to Kaiwa
            </Button>

            <Text className="mt-8">
              Best,
              <br /> Kaiwa Team
            </Text>
            <Text className="mt-8 text-gray-500">
              If you didn&apos;t try to login, you can safely ignore this email.
            </Text>
          </Container>
          <Hr />
        </Body>
      </Tailwind>
    </Html>
  )
}
export default VerificationEmail

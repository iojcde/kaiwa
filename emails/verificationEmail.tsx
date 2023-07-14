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
  const previewText = `Verify your email for Kaiwa`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded-xl border border-solid border-[#eaeaea] p-[20px]">
            <Text className="text-[14px] font-medium leading-[24px] text-black">
              Hello,
            </Text>
            <Text>Here&apos;s your link to verify your email on Kaiwa.</Text>
            <Text>Thanks for checking us out!</Text>

            <Section className=" mb-[32px] mt-[32px]">
              <Button
                pX={20}
                pY={12}
                className="rounded-lg bg-[#000000] font-semibold text-white no-underline"
                href={url}
              >
                Verify my Email
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

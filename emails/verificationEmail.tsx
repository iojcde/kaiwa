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
} from "@react-email/components";
import * as React from "react";

export const VerificationEmail = ({ url }) => {
  const previewText = `Verify your email for Kaiwa`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-xl my-[40px] mx-auto p-[20px] w-[465px]">
            <Text className="text-black font-medium text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text>Here&apos;s your link to verify your email on Kaiwa.</Text>
            <Text>Thanks for checking us out!</Text>

            <Section className=" mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] rounded-lg text-white font-semibold no-underline"
                href={url}
              >
                Verify my Email
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

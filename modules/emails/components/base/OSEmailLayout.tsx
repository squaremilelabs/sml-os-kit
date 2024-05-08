import React from "react"
import EmailRoot from "./EmailRoot"
import { Body, Column, Container, Row, Section, Text } from "@react-email/components"
import brandConfig from "@/$sml-os-config/brand"

export default function OSEmailLayout({
  previewText,
  children,
}: {
  previewText: string
  children: React.ReactNode
}) {
  return (
    <EmailRoot previewText={previewText}>
      <Body className="bg-zinc-100 font-sans py-[24px] px-[8px]">
        <Container className="bg-white rounded border border-solid border-zinc-200">
          <Section className="px-[16px] py-[8px] border-b border-solid border-zinc-200">
            <Text className="text-xl text-primary font-semibold">{brandConfig.orgName}</Text>
          </Section>
          <Section className="min-h-[200px]">{children}</Section>
          <Section className="bg-primary px-[8px] rounded-bl rounded-br">
            <Row>
              <Column align="center">
                <Text className="text-primary-100 mx-auto">{brandConfig.appName}</Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </EmailRoot>
  )
}

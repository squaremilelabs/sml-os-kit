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
      <Body className="bg-zinc-100 px-[8px] py-[24px] font-sans">
        <Container className="rounded border border-solid border-zinc-200 bg-white">
          <Section className="border-b border-solid border-zinc-200 px-[16px] py-[8px]">
            <Text className="text-xl font-semibold text-primary">{brandConfig.appName}</Text>
          </Section>
          <Section className="min-h-[200px]">{children}</Section>
          <Section className="rounded-bl rounded-br bg-primary px-[8px]">
            <Row>
              <Column align="center">
                <Text className="mx-auto text-primary-100">{brandConfig.orgName}</Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </EmailRoot>
  )
}

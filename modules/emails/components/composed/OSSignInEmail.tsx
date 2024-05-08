import OSEmailLayout from "../base/OSEmailLayout"
import brandConfig from "@/$sml-os-config/brand"
import { Link, Section, Text } from "@react-email/components"

export default function OSSignInEmail({
  displayName,
  signInLink,
}: {
  displayName: string
  signInLink: string
}) {
  return (
    <OSEmailLayout previewText={`Use this link to sign into ${brandConfig.appName}`}>
      <Section className="px-[24px]">
        <Text>Hi {displayName},</Text>
        <Text className="mb-[8px]">
          Here is your sign-in link to{" "}
          <strong className="text-primary">{brandConfig.appName}</strong>
        </Text>
        <Link href={signInLink} className="text-zinc-600 underline text-sm">
          {signInLink}
        </Link>
        <Text className="leading-snug">
          Please keep this secure and <strong>do not forward this email</strong>. Anyone with this
          link can sign into {brandConfig.appName} as you. This link will expire after 1 use, or
          after 6 hours.
        </Text>
        <Text className="leading-snug">
          <strong>Signing in from a mobile device?</strong> Some devices display a preview when you
          press down on a link, or opens the page in a temporary browser. To ensure you stay logged
          in on this device, you should copy and paste the link into your mobile browser.
        </Text>
      </Section>
    </OSEmailLayout>
  )
}

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
        <Text className="mb-0">
          <strong>Here is your sign-in link to {brandConfig.appName}</strong>
        </Text>
        <Link href={signInLink} className="text-zinc-600 underline text-sm mt-0">
          {signInLink}
        </Link>
        <Text>
          Note that this link will only work one time on one device, and will expire in 1 hour.
        </Text>
      </Section>
    </OSEmailLayout>
  )
}

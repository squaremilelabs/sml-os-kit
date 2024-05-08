"use server"

import formData from "form-data"
import Mailgun from "mailgun.js"
import { renderAsync } from "@react-email/render"
import brandConfig from "@/$sml-os-config/brand"

const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY as string })

interface SendEmailParams {
  to: string | string[]
  cc?: string | string[]
  subject: string
  replyTo?: string
}

export default async function _sendEmail(
  Component: Parameters<typeof renderAsync>[0],
  params: SendEmailParams
) {
  const sender = `${brandConfig.orgName} <${brandConfig.orgSlug}@${process.env.MAILGUN_DOMAIN}>`
  const html = await renderAsync(Component)

  return mg.messages.create(process.env.MAILGUN_DOMAIN as string, {
    "from": sender,
    "to": params.to,
    "cc": params.cc,
    "h:Reply-To": params.replyTo,
    "subject": params.subject,
    "html": html,
  })
}

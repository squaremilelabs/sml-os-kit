import brandConfig from "@/$sml-os-config/brand"
import { Metadata } from "next"

const adminMetadata: Metadata = {
  title: {
    default: `Admin`,
    template: `%s | Admin | ${brandConfig.appName}`,
  },
}

export default adminMetadata

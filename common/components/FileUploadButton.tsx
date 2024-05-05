import { Button, ButtonProps } from "@nextui-org/react"
import { ChangeEvent } from "react"

interface InputFileProps {
  onFileUpload: (file: File) => any | Promise<any>
  accept?: string
  isMultiple?: boolean
}

export default function FileUploadButton({
  onFileUpload,
  accept,
  isMultiple,
  children,
  ...buttonProps
}: Omit<ButtonProps, "as"> & InputFileProps) {
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const file = files?.item(0)
    if (file) {
      await onFileUpload(file)
    }
  }

  return (
    <Button as="label" {...buttonProps}>
      {children}
      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={isMultiple}
        onChange={handleFileUpload}
      />
    </Button>
  )
}

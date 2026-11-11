import { useCallback, useState, useEffect } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

  // Cleanup blob URL on unmount or when fileUrl changes to prevent memory leak
  useEffect(() => {
    return () => {
      if (fileUrl && fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl])

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Revoke previous blob URL if exists
      if (fileUrl && fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl)
      }

      fieldChange(acceptedFiles)
      setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    },
    [fieldChange, fileUrl]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxSize: 10 * 1024 * 1024, // 10MB limit
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="Uploaded preview"
              className="file_uploader-img"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="Upload icon"
            width={96}
            height={77}
            aria-hidden="true"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag your photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">JPG, PNG (max 10MB)</p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader

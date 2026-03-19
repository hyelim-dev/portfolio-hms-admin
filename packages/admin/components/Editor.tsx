import MainWrap from '@/components/wrappers/MainWrap'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { useForm } from 'react-hook-form'
import { Button } from '@nextui-org/react'
import { useMemo, useRef, useState } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import { styled } from 'styled-components'

const EditorBox = styled.div`
  img {
    display: inline-block;
  }
`

interface ForwardedQuillComponent extends ReactQuillProps {
  forwardedRef: React.Ref<ReactQuill>
}

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: QuillComponent } = await import('react-quill')
    const Quill = ({ forwardedRef, ...props }: ForwardedQuillComponent) => (
      <QuillComponent ref={forwardedRef} {...props} />
    )
    return Quill
  },
  { loading: () => <div>...loading</div>, ssr: false },
)

export default function EditorViewer({ view }) {
  const quillRef = useRef<ReactQuill>()
  const [editorContent, setEditorContent] = useState('')
  const [imagesToUpload, setImagesToUpload] = useState([])
  const { register, setValue, handleSubmit } = useForm()
  const onEditorStateChange = editorState => {
    console.log(editorState)
    setEditorContent(editorState)
    // setValue('emailContent', editorState)
  }
  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return

      const editor = quillRef.current.getEditor()
      const range = editor.getSelection()

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const imageSrc = reader.result
        // 가져온 위치에 이미지를 삽입한다
        setImagesToUpload(prev => [...prev, { file, imageSrc }])
        editor.insertEmbed(range.index, 'image', imageSrc)
      }

      reader.onerror = error => {
        console.error('Image read error: ', error)
      }
    })
  }
  const uploadImagesAndReplaceUrls = content => {
    let updatedContent = content

    for (let image of imagesToUpload) {
      const imageUrl = uploadImageToServer(image.file) // 이미지 서버로 업로드
      console.log(imageUrl)
      updatedContent = updatedContent.replace(image.imageSrc, imageUrl) // base64를 실제 URL로 대체
    }

    return updatedContent
  }

  const uploadImageToServer = file => {
    //  const formData = new FormData()
    //  formData.append('file', file)

    //  const response = await fetch('/api/upload', {
    //    method: 'POST',
    //    body: formData,
    //  })

    //  const data = await response.json()
    console.log(file.name + 'urlurl')
    return file.name + 'urlurl' // 서버에 저장된 이미지 URL 반환
  }

  const onSubmit = data => {
    console.log('editorContent', editorContent)
    console.log('imagesToUpload', imagesToUpload)
    const updatedContent = uploadImagesAndReplaceUrls(editorContent)
    console.log('finish', updatedContent)
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
          ['link', 'image'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }
  }, [])

  return (
    <EditorBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <QuillNoSSRWrapper
          forwardedRef={quillRef}
          onChange={onEditorStateChange}
          modules={modules}
          className="editor"
          defaultValue={view}
        />
        <Button type="submit">수정</Button>
      </form>
    </EditorBox>
  )
}

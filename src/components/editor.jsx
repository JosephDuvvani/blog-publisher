import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import '../../public/editor.css'
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaHeading,
  FaListUl,
  FaListOl,
  FaCodeBranch,
  FaRedo,
  FaUndo,
  FaUnderline,
}
  from 'react-icons/fa'

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <div>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            <FaUndo />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            <FaRedo />
          </button>
        </div>
        <div className='center-menu'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleUnderline()
                .run()
            }
            className={editor.isActive('underline') ? 'is-active' : ''}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            className={editor.isActive('code') ? 'is-active' : ''}
          >
            <FaCode />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            <FaHeading />1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            <FaHeading />2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          >
            <FaHeading />3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <FaListUl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <FaListOl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
          >
            <FaCodeBranch />
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            Line
          </button>
        </div>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Underline,
]

const Editor = ({ title, caption, content, setTitle, setCaption, setContent }) => {
  const handleChange = ({ editor }) => {
    setContent(editor.getJSON())
  }

  return (
    <>
      <div className='title-editor'>
        <label htmlFor="title">Title</label>
        <input type="text" defaultValue={title} id='title' onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className='caption-editor'>
        <label htmlFor="caption">Caption</label>
        <textarea id='caption' defaultValue={caption} rows={3} onChange={(e) => setCaption(e.target.value)}></textarea>
      </div>
      <div className="text-editor">
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
          onUpdate={handleChange}
        />
      </div>
    </>
  )
}

export default Editor
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Highlighter,
  Undo,
  Redo,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'İçeriğinizi buraya yazın...' }),
      Highlight,
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const url = prompt('URL girin:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: () => editor.isActive('bold'), title: 'Kalın' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: () => editor.isActive('italic'), title: 'İtalik' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.isActive('heading', { level: 2 }), title: 'H2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor.isActive('heading', { level: 3 }), title: 'H3' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: () => editor.isActive('bulletList'), title: 'Liste' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: () => editor.isActive('orderedList'), title: 'Numaralı Liste' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: () => editor.isActive('blockquote'), title: 'Alıntı' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: () => editor.isActive('code'), title: 'Kod' },
    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: () => editor.isActive('highlight'), title: 'Vurgula' },
    { icon: LinkIcon, action: setLink, active: () => editor.isActive('link'), title: 'Link' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: () => false, title: 'Geri Al' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: () => false, title: 'İleri Al' },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-gray-100 bg-gray-50">
        {tools.map((tool, i) => (
          <button
            key={i}
            type="button"
            onClick={tool.action}
            title={tool.title}
            className={cn(
              'p-1.5 rounded-lg text-sm transition-colors',
              tool.active()
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            )}
          >
            <tool.icon size={15} />
          </button>
        ))}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}

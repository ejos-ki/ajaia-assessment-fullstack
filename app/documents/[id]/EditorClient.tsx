"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Bold,
  Italic,
  UnderlineIcon,
  Heading2,
  List,
  ListOrdered,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import ShareDialog from "@/components/dashboard/ShareDialog";

interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

interface EditorClientProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  isOwner: boolean;
  sharedWithIds: string[];
  availableUsers: AvailableUser[];
}

const AUTO_SAVE_DELAY_MS = 1000;

export default function EditorClient({
  documentId,
  initialTitle,
  initialContent,
  isOwner,
  sharedWithIds,
  availableUsers,
}: EditorClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      scheduleAutoSave({ content: editor.getHTML() });
    },
  });

  function scheduleAutoSave(fields: { title?: string; content?: string }) {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });

        if (!response.ok) {
          setSaveStatus("error");
          toast.error("Failed to save changes");
          return;
        }
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
        toast.error("Network error while saving");
      }
    }, AUTO_SAVE_DELAY_MS);
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    scheduleAutoSave({ title: newTitle });
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-7 h-7 rounded-md bg-teal-700 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-white" />
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Dashboard
          </button>
          <div className="w-px h-4.5 bg-gray-200" />
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-[15px] font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:bg-gray-50 rounded-md px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 size={14} className="text-teal-600" />
                Saved
              </>
            )}
            {saveStatus === "error" && "Failed to save"}
          </span>
          {isOwner && (
            <button
              onClick={() => setIsShareDialogOpen(true)}
              className="flex items-center gap-1.5 bg-teal-700 text-white rounded-lg px-3.5 py-1.5 text-sm font-medium hover:bg-teal-800 transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
          )}
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-t-xl px-3 py-2 flex items-center gap-0.5">
            <EditorToolbar editor={editor} />
          </div>
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl px-10 py-8 min-h-100">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none text-gray-800 focus:outline-none [&_.ProseMirror]:focus:outline-none"
            />
          </div>
        </div>
      </main>

      {isShareDialogOpen && (
        <ShareDialog
          documentId={documentId}
          documentTitle={title}
          availableUsers={availableUsers}
          initialSharedIds={sharedWithIds}
          onClose={() => setIsShareDialogOpen(false)}
          onShared={() => {}}
        />
      )}
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const iconButtonClasses = (isActive: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
      isActive ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50"
    }`;

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        className={iconButtonClasses(editor.isActive("bold"))}
      >
        <Bold size={15} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        className={iconButtonClasses(editor.isActive("italic"))}
      >
        <Italic size={15} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
        className={iconButtonClasses(editor.isActive("underline"))}
      >
        <UnderlineIcon size={15} />
      </button>
      <div className="w-px h-4.5 bg-gray-200 mx-1.5" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading"
        className={iconButtonClasses(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 size={15} />
      </button>
      <div className="w-px h-4.5 bg-gray-200 mx-1.5" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
        className={iconButtonClasses(editor.isActive("bulletList"))}
      >
        <List size={15} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Numbered list"
        className={iconButtonClasses(editor.isActive("orderedList"))}
      >
        <ListOrdered size={15} />
      </button>
    </>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

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

// How long to wait after the user stops typing before saving.
// Balances "feels instant" against not spamming the API on every keystroke.
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
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false);
  const [sharedUserIds, setSharedUserIds] = useState<string[]>(sharedWithIds);
  const [shareErrorMessage, setShareErrorMessage] = useState("");

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      scheduleAutoSave({ content: editor.getHTML() });
    },
  });

  // Debounced save: clears any pending save and schedules a new one,
  // so rapid typing results in one save shortly after the user pauses,
  // not one save per keystroke.
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
        setSaveStatus(response.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    }, AUTO_SAVE_DELAY_MS);
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    scheduleAutoSave({ title: newTitle });
  }

  async function handleToggleShare(userId: string) {
    setShareErrorMessage("");
    const isCurrentlyShared = sharedUserIds.includes(userId);
    const updatedSharedUserIds = isCurrentlyShared
      ? sharedUserIds.filter((id) => id !== userId)
      : [...sharedUserIds, userId];

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWith: updatedSharedUserIds }),
      });
      const data = await response.json();

      if (!response.ok) {
        setShareErrorMessage(data.error || "Failed to update sharing");
        return;
      }

      setSharedUserIds(updatedSharedUserIds);
    } catch {
      setShareErrorMessage("Network error while updating sharing");
    }
  }

  // Clean up any pending save timer on unmount, so we don't fire a
  // save after the component is gone.
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f4ecd8]">
      <header className="border-b border-[#d9c9a3] bg-[#fffdf7] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-[#5c4326] hover:underline font-serif"
          >
            ← Dashboard
          </button>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-lg font-serif font-semibold text-[#3d2b1f] bg-transparent border-none focus:outline-none focus:bg-[#f4ecd8] rounded-sm px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#9c8a6c] font-serif italic">
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "error" && "Failed to save"}
          </span>
          {isOwner && (
            <button
              onClick={() => setIsSharePanelOpen((open) => !open)}
              className="text-sm text-[#5c4326] border border-[#d9c9a3] rounded-sm px-4 py-2 hover:bg-[#f4ecd8] font-serif transition-colors"
            >
              Share
            </button>
          )}
        </div>
      </header>

      {isSharePanelOpen && (
        <div className="max-w-3xl mx-auto mt-4 px-6">
          <div className="bg-[#fffdf7] border border-[#d9c9a3] rounded-sm p-4">
            <p className="text-sm font-serif text-[#3d2b1f] mb-3">
              Share with:
            </p>
            {shareErrorMessage && (
              <p className="text-sm text-[#8b3a2f] mb-2 font-serif">{shareErrorMessage}</p>
            )}
            <ul className="space-y-2">
              {availableUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <span className="text-sm font-serif text-[#3d2b1f]">
                    {user.name} ({user.email})
                  </span>
                  <button
                    onClick={() => handleToggleShare(user.id)}
                    className={`text-xs px-3 py-1 rounded-sm font-serif transition-colors ${
                      sharedUserIds.includes(user.id)
                        ? "bg-[#5c4326] text-[#fffdf7]"
                        : "border border-[#d9c9a3] text-[#5c4326]"
                    }`}
                  >
                    {sharedUserIds.includes(user.id) ? "Shared" : "Share"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-[#fffdf7] border border-[#d9c9a3] rounded-sm">
          <EditorToolbar editor={editor} />
          <div className="px-6 py-6 min-h-[400px]">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none font-serif text-[#3d2b1f] focus:outline-none [&_.ProseMirror]:focus:outline-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Small formatting toolbar. Kept in the same file since it's tightly
// coupled to this editor instance and not reused elsewhere.
function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttonBaseClasses =
    "px-3 py-1.5 text-sm font-serif rounded-sm transition-colors";
  const activeClasses = "bg-[#5c4326] text-[#fffdf7]";
  const inactiveClasses = "text-[#5c4326] hover:bg-[#f4ecd8]";

  return (
    <div className="flex items-center gap-1 border-b border-[#d9c9a3] px-4 py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonBaseClasses} ${editor.isActive("bold") ? activeClasses : inactiveClasses}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonBaseClasses} ${editor.isActive("italic") ? activeClasses : inactiveClasses}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${buttonBaseClasses} ${editor.isActive("underline") ? activeClasses : inactiveClasses}`}
      >
        Underline
      </button>
      <div className="w-px h-5 bg-[#d9c9a3] mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonBaseClasses} ${editor.isActive("heading", { level: 2 }) ? activeClasses : inactiveClasses}`}
      >
        Heading
      </button>
      <div className="w-px h-5 bg-[#d9c9a3] mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonBaseClasses} ${editor.isActive("bulletList") ? activeClasses : inactiveClasses}`}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${buttonBaseClasses} ${editor.isActive("orderedList") ? activeClasses : inactiveClasses}`}
      >
        1. List
      </button>
    </div>
  );
}
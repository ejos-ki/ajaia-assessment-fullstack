import type { PresenceViewer } from "@/hooks/usePresence";

interface PresenceAvatarsProps {
  viewers: PresenceViewer[];
  currentUserName: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Overlapping avatar stack showing who else currently has this document
// open, excluding the current user themselves.
export default function PresenceAvatars({ viewers, currentUserName }: PresenceAvatarsProps) {
  const otherViewers = viewers.filter((viewer) => viewer.userName !== currentUserName);

  if (otherViewers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {otherViewers.map((viewer) => (
        <div
          key={viewer.userId}
          title={`${viewer.userName} is viewing`}
          className="w-7 h-7 rounded-full bg-teal-700 border-2 border-white flex items-center justify-center text-[10px] font-medium text-white"
        >
          {getInitials(viewer.userName)}
        </div>
      ))}
    </div>
  );
}
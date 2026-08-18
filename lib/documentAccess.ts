// Pure authorization logic for document access, extracted from the API
// route so it can be unit tested without spinning up a database or an
// HTTP server.

export interface DocumentAccessCheck {
  ownerId: string;
  sharedWithIds: string[];
  requestingUserId: string;
}

export interface DocumentAccessResult {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isOwner: boolean;
}

export function checkDocumentAccess({
  ownerId,
  sharedWithIds,
  requestingUserId,
}: DocumentAccessCheck): DocumentAccessResult {
  const isOwner = ownerId === requestingUserId;
  const isSharedCollaborator = sharedWithIds.includes(requestingUserId);
  const hasAnyAccess = isOwner || isSharedCollaborator;

  return {
    canView: hasAnyAccess,
    canEdit: hasAnyAccess,
    canDelete: isOwner, // only the owner may delete, per assessment scope
    isOwner,
  };
}
import { describe, it, expect } from "vitest";
import { checkDocumentAccess } from "./documentAccess";

describe("checkDocumentAccess", () => {
  const ownerId = "owner-123";
  const sharedUserId = "shared-456";
  const strangerUserId = "stranger-789";

  it("grants the owner full access including delete", () => {
    const result = checkDocumentAccess({
      ownerId,
      sharedWithIds: [sharedUserId],
      requestingUserId: ownerId,
    });

    expect(result.isOwner).toBe(true);
    expect(result.canView).toBe(true);
    expect(result.canEdit).toBe(true);
    expect(result.canDelete).toBe(true);
  });

  it("grants a shared collaborator view and edit access, but not delete", () => {
    const result = checkDocumentAccess({
      ownerId,
      sharedWithIds: [sharedUserId],
      requestingUserId: sharedUserId,
    });

    expect(result.isOwner).toBe(false);
    expect(result.canView).toBe(true);
    expect(result.canEdit).toBe(true);
    expect(result.canDelete).toBe(false);
  });

  it("denies all access to a user who is neither owner nor shared", () => {
    const result = checkDocumentAccess({
      ownerId,
      sharedWithIds: [sharedUserId],
      requestingUserId: strangerUserId,
    });

    expect(result.isOwner).toBe(false);
    expect(result.canView).toBe(false);
    expect(result.canEdit).toBe(false);
    expect(result.canDelete).toBe(false);
  });

  it("denies delete access even if the document has no collaborators", () => {
    const result = checkDocumentAccess({
      ownerId,
      sharedWithIds: [],
      requestingUserId: strangerUserId,
    });

    expect(result.canDelete).toBe(false);
  });
});
// Server component: verifies the session server-side before rendering
// anything, so there's no flash of the dashboard for unauthenticated
// visitors. Actual list rendering + interactivity lives in the client
// component below, since it needs local state for create/delete.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const currentUser = await User.findById(session.userId).select("name email");

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <DashboardClient
      currentUserName={currentUser.name}
      currentUserEmail={currentUser.email}
    />
  );
}
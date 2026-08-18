import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const currentUser = await User.findById(session.userId).select("name email");
  if (!currentUser) redirect("/login");

  const otherUsers = await User.find({ _id: { $ne: session.userId } }).select("name email");

  return (
    <DashboardClient
      currentUserName={currentUser.name}
      currentUserEmail={currentUser.email}
      availableUsers={otherUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
      }))}
    />
  );
}
// Root route acts as a redirect gate: authenticated users go straight
// to their documents, everyone else goes to login. Keeps a single
// entry point instead of duplicating the login UI at "/".

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");
}
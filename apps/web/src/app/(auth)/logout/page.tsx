import { redirect } from "next/navigation";
import { signOutCurrentSession } from "@/features/auth/server/logout";

export default async function LogoutPage() {
  await signOutCurrentSession();
  redirect("/login");
}

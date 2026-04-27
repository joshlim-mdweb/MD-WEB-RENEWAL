import { redirect } from "next/navigation";

// Legacy route — canonical path is now /my/history
export default function Page() {
  redirect("/my/history");
}

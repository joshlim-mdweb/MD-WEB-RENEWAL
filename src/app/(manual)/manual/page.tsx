import { redirect } from "next/navigation";
import { getVersions } from "@/lib/manual/db";

export default async function ManualRoot() {
  const versions = await getVersions();
  redirect(`/manual/${versions[0].code}`);
}

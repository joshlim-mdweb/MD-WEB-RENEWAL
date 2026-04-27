import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// /my/asset is now /my/point — redirect for backward compatibility
export default function AssetPage() {
  redirect("/my/point");
}

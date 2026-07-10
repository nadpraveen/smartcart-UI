import { Suspense } from "react";
import ManagePageClient from "./ManagePageClient";

export default function ManagePage() {
  return (
    <Suspense fallback={null}>
      <ManagePageClient />
    </Suspense>
  );
}

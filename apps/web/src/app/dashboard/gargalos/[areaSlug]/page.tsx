import { notFound } from "next/navigation";

import { requireSession } from "@/features/auth/server/session";
import { BottleneckDetail } from "@/features/dashboard/components/bottleneck-detail";
import { getBottleneckBySlug } from "@/features/dashboard/data/organization-dashboard-fixture";

type BottleneckPageProps = {
  params: Promise<{ areaSlug: string }>;
};

export default async function BottleneckPage({ params }: BottleneckPageProps) {
  const { areaSlug } = await params;
  await requireSession(`/dashboard/gargalos/${areaSlug}`);
  const bottleneck = getBottleneckBySlug(areaSlug);

  if (!bottleneck) {
    notFound();
  }

  return <BottleneckDetail bottleneck={bottleneck} />;
}

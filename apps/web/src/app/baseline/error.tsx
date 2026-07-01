"use client";
import { RouteError } from "@/components/route-error";
export default function BaselineError({ reset }: { reset: () => void }) { return <RouteError reset={reset} title="Não foi possível carregar o baseline" />; }

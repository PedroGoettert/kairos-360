"use client";
import { RouteError } from "@/components/route-error";
export default function SettingsError({ reset }: { reset: () => void }) { return <RouteError reset={reset} title="Não foi possível carregar as configurações" />; }

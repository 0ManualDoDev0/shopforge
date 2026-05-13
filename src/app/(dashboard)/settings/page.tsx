import type { Metadata } from "next";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const metadata: Metadata = { title: "Configurações — Admin" };

export default function SettingsPage() {
  return <SettingsForm />;
}

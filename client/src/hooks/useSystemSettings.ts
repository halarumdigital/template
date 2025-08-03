import { useQuery } from "@tanstack/react-query";

export function useSystemSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/system/settings"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    settings,
    isLoading,
    systemName: settings?.systemName || "Sistema de Gerenciamento",
    favicon: settings?.favicon,
    logo: settings?.logo,
    systemColor: settings?.systemColor || "#3b82f6",
  };
}
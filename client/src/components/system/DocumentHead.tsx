import { useEffect } from "react";
import { useSystemSettings } from "@/hooks/useSystemSettings";

interface DocumentHeadProps {
  title?: string;
}

export default function DocumentHead({ title }: DocumentHeadProps) {
  const { systemName, favicon } = useSystemSettings();

  useEffect(() => {
    // Update document title
    const pageTitle = title ? `${title} - ${systemName}` : systemName;
    document.title = pageTitle;
  }, [title, systemName]);

  useEffect(() => {
    // Update favicon
    if (favicon) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(link => link.remove());

      // Add new favicon
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      faviconLink.href = favicon;
      document.head.appendChild(faviconLink);

      // Add apple-touch-icon for better mobile support
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = favicon;
      document.head.appendChild(appleTouchIcon);
    }
  }, [favicon]);

  return null; // This component doesn't render anything
}
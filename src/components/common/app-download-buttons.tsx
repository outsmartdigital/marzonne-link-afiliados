import { Apple, Play } from 'lucide-react';

interface AppDownloadButtonsProps {
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export function AppDownloadButtons({
  appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || '#',
  playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL || '#',
}: AppDownloadButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Apple className="w-8 h-8" />
        <div className="text-left">
          <p className="text-xs text-gray-400">Download on the</p>
          <p className="text-lg font-semibold">App Store</p>
        </div>
      </a>

      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Play className="w-8 h-8" />
        <div className="text-left">
          <p className="text-xs text-gray-400">Get it on</p>
          <p className="text-lg font-semibold">Google Play</p>
        </div>
      </a>
    </div>
  );
}

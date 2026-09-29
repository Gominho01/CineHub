import Image from "next/image";
import { providerLogoUrl } from "@/lib/tmdb";
import type { WatchProvidersResponse } from "@/types/tmdb";

export function WatchProviders({ providers }: { providers: WatchProvidersResponse | undefined }) {
  const region = providers?.results.US;
  const list = region?.flatrate ?? region?.rent ?? region?.buy;

  if (!region || !list || list.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">Where to Watch</h2>
      <div className="flex flex-wrap gap-3">
        {list.map((provider) => (
          <a
            key={provider.provider_id}
            href={region.link}
            target="_blank"
            rel="noreferrer"
            title={provider.provider_name}
            className="block h-10 w-10 overflow-hidden rounded-lg"
          >
            <Image
              src={providerLogoUrl(provider.logo_path)}
              alt={provider.provider_name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </a>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/40">Data provided by JustWatch</p>
    </div>
  );
}

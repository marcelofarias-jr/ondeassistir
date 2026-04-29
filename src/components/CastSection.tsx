import Image from "next/image";
import type { CastMember } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";
import { User } from "lucide-react";

interface Props {
  cast: CastMember[];
}

export default function CastSection({ cast }: Props) {
  if (!cast.length) return null;

  const visible = cast.slice(0, 20);

  return (
    <div>
      <h2 className="text-white font-bold text-xl mb-4">Elenco Principal</h2>
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {visible.map((member) => {
            const photo = getImageUrl(member.profilePath, "w200");
            return (
              <div key={member.id} className="w-24 shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 mb-2 border border-zinc-700">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                  {member.name}
                </p>
                {member.character && (
                  <p className="text-zinc-500 text-[10px] leading-snug line-clamp-2 mt-0.5">
                    {member.character}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

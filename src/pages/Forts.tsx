import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Mountain, Waves, LandPlot } from "lucide-react";

import type { Fort } from "@/types";
import { getForts } from "@/lib/api";

const Forts = () => {
  const [region, setRegion] = useState<string | undefined>();
  const [type, setType] = useState<Fort["type"] | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["forts", region, type],
    queryFn: () => getForts({ region, type }),
  });

  const forts = data ?? [];

  return (
    <div className="bg-shiv-dark min-h-screen pt-24 px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-white">
            Fort Explorer <span className="text-shiv-orange italic">(Preview)</span>
          </h1>
          <p className="text-white/60 font-serif italic mt-3 leading-shiv max-w-3xl">
            Backend-ready grid of key forts (Raigad, Pratapgad, Sinhagad). PRD-scale 350+ forts can plug into the same API.
          </p>
        </header>

        <section className="flex flex-wrap gap-4 mb-8">
          <select
            value={region ?? ""}
            onChange={(e) => setRegion(e.target.value || undefined)}
            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-2"
          >
            <option value="">All regions</option>
            <option value="Konkan">Konkan</option>
            <option value="Satara">Satara</option>
            <option value="Pune">Pune</option>
          </select>
          <select
            value={type ?? ""}
            onChange={(e) => setType((e.target.value || undefined) as any)}
            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-2"
          >
            <option value="">All types</option>
            <option value="hill">Hill</option>
            <option value="sea">Sea</option>
            <option value="land">Land</option>
          </select>
        </section>

        {isLoading ? (
          <p className="text-white/60 font-serif italic">Loading forts…</p>
        ) : forts.length === 0 ? (
          <p className="text-white/60 font-serif italic">No forts match the filters.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forts.map((f) => (
              <article key={f.id} className="bg-white/5 border border-white/10 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-black">{f.name}</h2>
                  {f.type && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-white/60">
                      {f.type === "hill" && <Mountain size={14} />}
                      {f.type === "sea" && <Waves size={14} />}
                      {f.type === "land" && <LandPlot size={14} />}
                      {f.type}
                    </span>
                  )}
                </div>
                {f.nameMarathi && <div className="logo-marathi text-lg text-shiv-orange mb-2">{f.nameMarathi}</div>}
                {f.region && (
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                    <MapPin size={14} className="text-shiv-orange" /> {f.region}
                  </div>
                )}
                {f.strategicNotes && <p className="text-sm text-white/70 font-serif italic">{f.strategicNotes}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forts;


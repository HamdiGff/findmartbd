"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Arrow, Minus, Plus } from "./Icons";
import { taka } from "@/lib/format";

type Gear = { slug: string; name: string; price: number; image: string };

const APPLIANCES = [
  { id: "led", name: "LED bulb", watts: 10, max: 8, start: 3 },
  { id: "fan", name: "Ceiling fan", watts: 60, max: 6, start: 2 },
  { id: "router", name: "Wi-Fi router", watts: 12, max: 2, start: 1 },
  { id: "phone", name: "Phone charging", watts: 10, max: 6, start: 2 },
  { id: "tv", name: "LED TV, 32 inch", watts: 50, max: 2, start: 0 },
  { id: "laptop", name: "Laptop", watts: 60, max: 3, start: 0 },
];
const HOURS = [2, 4, 6, 8];

// Usable share of a battery after inverter losses (about 15%) and keeping 20% in reserve.
const USABLE = 0.7;

export function BackupPlanner({ gear }: { gear: Gear[] }) {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(APPLIANCES.map((a) => [a.id, a.start])));
  const [hours, setHours] = useState(4);

  const r = useMemo(() => {
    const watts = APPLIANCES.reduce((sum, a) => sum + a.watts * (qty[a.id] ?? 0), 0);
    const wh = (watts * hours) / USABLE;
    return {
      watts,
      wh: watts ? Math.ceil(wh / 100) * 100 : 0,
      ah: watts ? Math.ceil(wh / 12 / 10) * 10 : 0,
      inverter: watts ? Math.ceil((watts * 1.25) / 100) * 100 : 0,
    };
  }, [qty, hours]);

  const step = (id: string, d: number, max: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(max, (q[id] ?? 0) + d)) }));

  return (
    <div className="planner">
      <div className="planner__head">
        <h2>How much backup do you need for load-shedding?</h2>
        <p>Choose what should keep running and for how long. The planner works out the battery and inverter size to look for.</p>
      </div>

      <div className="planner__body">
        <div className="planner__controls">
          <ul className="planner__list">
            {APPLIANCES.map((a) => (
              <li key={a.id} data-on={(qty[a.id] ?? 0) > 0}>
                <span className="planner__name">
                  {a.name}
                  <small>{a.watts} W each</small>
                </span>
                <span className="planner__step">
                  <button type="button" aria-label={`Fewer ${a.name}`} onClick={() => step(a.id, -1, a.max)} disabled={!qty[a.id]}>
                    <Minus size={15} />
                  </button>
                  <output aria-live="polite">{qty[a.id] ?? 0}</output>
                  <button type="button" aria-label={`More ${a.name}`} onClick={() => step(a.id, 1, a.max)} disabled={(qty[a.id] ?? 0) >= a.max}>
                    <Plus size={15} />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <div className="planner__hours" role="radiogroup" aria-label="Hours of backup">
            <span className="planner__hl">Backup time</span>
            {HOURS.map((h) => (
              <button key={h} type="button" role="radio" aria-checked={hours === h} data-on={hours === h} onClick={() => setHours(h)}>
                {h} hours
              </button>
            ))}
          </div>
        </div>

        <div className="planner__result" aria-live="polite">
          {r.watts > 0 ? (
            <>
              <p className="planner__lead">Look for a battery of about</p>
              <p className="planner__big">
                {r.wh.toLocaleString("en-IN")}
                <small> Wh</small>
              </p>
              <ul className="planner__facts">
                <li>
                  <b>{r.watts} W</b>
                  <span>total load</span>
                </li>
                <li>
                  <b>{r.ah} Ah</b>
                  <span>on a 12 V battery</span>
                </li>
                <li>
                  <b>{r.inverter} W</b>
                  <span>inverter or larger</span>
                </li>
              </ul>
            </>
          ) : (
            <p className="planner__lead">Add at least one appliance to see the size you need.</p>
          )}
          <Link href="/category/solar-power-backup" className="btn btn--brand btn--lg planner__cta">
            See backup gear <Arrow size={18} />
          </Link>
          <p className="planner__note">A planning estimate. It allows for inverter losses and keeps 20% of the battery in reserve.</p>
        </div>
      </div>

      {gear.length > 0 && (
        <div className="planner__gear">
          <p>Popular in solar and backup</p>
          <ul>
            {gear.map((g) => (
              <li key={g.slug}>
                <Link href={`/product/${g.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image} alt="" width={64} height={64} loading="lazy" />
                  <span>
                    {g.name}
                    <b>{taka(g.price)}</b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

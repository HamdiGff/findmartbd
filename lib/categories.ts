// Our own categories. Dropshop's categories are not usable ("All Products"),
// so products are sorted into these by keywords in their names. First match wins.

export type CategoryDef = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  tint: string; // soft background
  accent: string; // button colour
  match: RegExp;
};

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "smart-watches",
    name: "Smart Watches",
    short: "Smart Watch",
    blurb: "Calling, fitness and AMOLED displays",
    icon: "watch-smart",
    tint: "#D9DCFF",
    accent: "#3438D1",
    match: /smart ?watch|smartwatch|fitness band|fitness tracker|smart band|watch ultra|\bcolmi\b|kospet/i,
  },
  {
    slug: "earbuds-headphones",
    name: "Earbuds & Headphones",
    short: "Audio",
    blurb: "ANC, TWS, neckbands and gaming headsets",
    icon: "headphones",
    tint: "#FFD8C2",
    accent: "#D9480F",
    match: /earbud|ear ?buds|headphone|headset|neckband|\btws\b|earphone|\bbuds\b|in-ear|open-ear|melobuds|airpods/i,
  },
  {
    slug: "speakers",
    name: "Speakers",
    short: "Speakers",
    blurb: "Portable, party and soundbars",
    icon: "speaker",
    tint: "#FFCFCB",
    accent: "#C92A2A",
    match: /speaker|soundbar|sound bar/i,
  },
  {
    slug: "power-charging",
    name: "Power & Charging",
    short: "Power",
    blurb: "Power banks, GaN chargers and cables",
    icon: "battery",
    tint: "#E6F27F",
    accent: "#4D6B00",
    match: /power ?bank|charger|charging|cable|adapter|\bgan\b|\d+mah|battery|magsafe|car charger|hub\b/i,
  },
  {
    slug: "solar-power-backup",
    name: "Solar & Power Backup",
    short: "Solar",
    blurb: "MPPT controllers, power stations, DC breakers",
    icon: "sun",
    tint: "#FFE9A6",
    accent: "#A15C00",
    match: /(?<!3d crystal ball[ -]*)(?<!ball[ -]*)\bsolar(?! system)|mppt|charge controller|power station|circuit breaker|\bips\b|inverter|lifepo4|dc breaker|surge/i,
  },
  {
    slug: "creator-gear",
    name: "Mics & Creator Gear",
    short: "Creator",
    blurb: "Microphones, tripods, gimbals and lights",
    icon: "mic",
    tint: "#E9D6FF",
    accent: "#7A2FD0",
    match: /microphone|\bmic\b|lavalier|tripod|selfie stick|gimbal|ring light|video light|led light panel|stabilizer|teleprompter|cold shoe|camera|audio interface|audio mixer|maonocaster|sound card|podcast/i,
  },
  {
    slug: "watches",
    name: "Wrist Watches",
    short: "Watches",
    blurb: "Titan, Fastrack and classic quartz",
    icon: "watch",
    tint: "#E6E0D4",
    accent: "#5F4B2B",
    match: /watch|strap|quartz|analog|chronograph/i,
  },
  {
    slug: "computer-networking",
    name: "Computer & Networking",
    short: "Computer",
    blurb: "Routers, mice, keyboards and storage",
    icon: "router",
    tint: "#CFE6FF",
    accent: "#0B63C6",
    match: /router|wi-?fi|mouse|keyboard|pen ?drive|flash drive|jumpdrive|ssd|memory card|micro ?sd|card reader|\busb\b|laptop|webcam|\bonu\b|projector|tv box|streamer|gaming console|presentation remote/i,
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    short: "Home",
    blurb: "Cookers, fans, lamps and smart home",
    icon: "home",
    tint: "#CDEFDA",
    accent: "#0F7A47",
    match: /cooker|kettle|blender|juicer|fan\b|fans|humidifier|lamp|light|bulb|bottle|kitchen|iron|vacuum|cleaner|egg|organizer|storage box|solar|heater|mosquito|socket|extension|crystal ball|clock|air fryer|mixer grinder|mixer|slicer|mop|water tap|sewing|screwdriver|drill|tester|spray gun|laser|torch|flashlight|lighter|cooler/i,
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    short: "Grooming",
    blurb: "Trimmers, clippers, dryers and more",
    icon: "scissors",
    tint: "#FFD6E7",
    accent: "#B8185A",
    match: /trimmer|clipper|shaver|hair|dryer|straightener|massager|epilator|grooming|nail|beard|toothbrush|scale/i,
  },
  {
    slug: "accessories",
    name: "Phone & Gadget Accessories",
    short: "Accessories",
    blurb: "Holders, stands, cases and smart gadgets",
    icon: "phone",
    tint: "#DFE4E8",
    accent: "#3A4756",
    match: /.*/,
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export function categorize(name: string): string {
  for (const c of CATEGORIES) if (c.match.test(name)) return c.slug;
  return "accessories";
}

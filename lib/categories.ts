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
    tint: "#EEF0FF",
    accent: "#5B5BD6",
    match: /smart ?watch|smartwatch|fitness band|fitness tracker|smart band|watch ultra|\bcolmi\b|kospet/i,
  },
  {
    slug: "earbuds-headphones",
    name: "Earbuds & Headphones",
    short: "Audio",
    blurb: "ANC, TWS, neckbands and gaming headsets",
    icon: "headphones",
    tint: "#FFF1E6",
    accent: "#F06B1F",
    match: /earbud|ear ?buds|headphone|headset|neckband|\btws\b|earphone|\bbuds\b|in-ear|open-ear|melobuds|airpods/i,
  },
  {
    slug: "speakers",
    name: "Speakers",
    short: "Speakers",
    blurb: "Portable, party and soundbars",
    icon: "speaker",
    tint: "#E8F7F1",
    accent: "#13A26B",
    match: /speaker|soundbar|sound bar/i,
  },
  {
    slug: "power-charging",
    name: "Power & Charging",
    short: "Power",
    blurb: "Power banks, GaN chargers and cables",
    icon: "battery",
    tint: "#FFF7DB",
    accent: "#D49A00",
    match: /power ?bank|charger|charging|cable|adapter|\bgan\b|\d+mah|battery|magsafe|car charger|hub\b/i,
  },
  {
    slug: "solar-power-backup",
    name: "Solar & Power Backup",
    short: "Solar",
    blurb: "MPPT controllers, power stations, DC breakers",
    icon: "sun",
    tint: "#FFF4E0",
    accent: "#E07B00",
    match: /(?<!ball[ -]*)\bsolar(?! system)|mppt|charge controller|power station|circuit breaker|\bips\b|inverter|lifepo4|dc breaker|surge/i,
  },
  {
    slug: "creator-gear",
    name: "Mics & Creator Gear",
    short: "Creator",
    blurb: "Microphones, tripods, gimbals and lights",
    icon: "mic",
    tint: "#FDECEF",
    accent: "#E0445E",
    match: /microphone|\bmic\b|lavalier|tripod|selfie stick|gimbal|ring light|video light|led light panel|stabilizer|teleprompter|cold shoe|camera|audio interface|audio mixer|maonocaster|sound card|podcast/i,
  },
  {
    slug: "watches",
    name: "Wrist Watches",
    short: "Watches",
    blurb: "Titan, Fastrack and classic quartz",
    icon: "watch",
    tint: "#F3EEE7",
    accent: "#8A5A2B",
    match: /watch|strap|quartz|analog|chronograph/i,
  },
  {
    slug: "computer-networking",
    name: "Computer & Networking",
    short: "Computer",
    blurb: "Routers, mice, keyboards and storage",
    icon: "router",
    tint: "#E7F3FE",
    accent: "#1B7ED6",
    match: /router|wi-?fi|mouse|keyboard|pen ?drive|flash drive|jumpdrive|ssd|memory card|micro ?sd|card reader|\busb\b|laptop|webcam|\bonu\b|projector|tv box|streamer|gaming console|presentation remote/i,
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    short: "Home",
    blurb: "Cookers, fans, lamps and smart home",
    icon: "home",
    tint: "#EAF6EC",
    accent: "#2F8F46",
    match: /cooker|kettle|blender|juicer|fan\b|fans|humidifier|lamp|light|bulb|bottle|kitchen|iron|vacuum|cleaner|egg|organizer|storage box|solar|heater|mosquito|socket|extension|crystal ball|clock|air fryer|mixer grinder|mixer|slicer|mop|water tap|sewing|screwdriver|drill|tester|spray gun|laser|torch|flashlight|lighter|cooler/i,
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    short: "Grooming",
    blurb: "Trimmers, clippers, dryers and more",
    icon: "scissors",
    tint: "#F4ECFB",
    accent: "#8B4FD1",
    match: /trimmer|clipper|shaver|hair|dryer|straightener|massager|epilator|grooming|nail|beard|toothbrush|scale/i,
  },
  {
    slug: "accessories",
    name: "Phone & Gadget Accessories",
    short: "Accessories",
    blurb: "Holders, stands, cases and smart gadgets",
    icon: "phone",
    tint: "#EEF2F5",
    accent: "#4A5A6A",
    match: /.*/,
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export function categorize(name: string): string {
  for (const c of CATEGORIES) if (c.match.test(name)) return c.slug;
  return "accessories";
}

// Temporary sample catalog for the homepage design.
// Real products will come from the Dropshop feed once the backend is built.

export const SITE = "https://findmartbd.com";
const IMG = "https://dropshop.com.bd/uploads/";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
};

const p = (slug: string, name: string, brand: string, price: number, file: string, isNew = false): Product => ({
  slug,
  name,
  brand,
  price,
  image: IMG + file,
  isNew,
});

export const newArrivals: Product[] = [
  p("qcy-melobuds-n65-anc-black", "MeloBuds N65 ANC earbuds, black", "QCY", 4000, "1794125656-2c60308e.jpeg", true),
  p("hoco-y41-smart-watch", "Y41 smart watch with Bluetooth calling", "Hoco", 2649, "1794213820-31e5ff07.png", true),
  p("cmf-buds-neo-blue", "CMF Buds Neo true wireless earbuds, blue", "Nothing", 4369, "1794142555-b8c09548.jpg", true),
  p("qcy-pulse-pb10h", "Pulse PB10H 22.5W power bank, 10000mAh", "QCY", 2249, "1794138431-fedae552.jpeg", true),
  p("acefast-w6-tws", "W6 TWS earbuds", "Acefast", 2289, "1794211950-c7880b43.jpeg", true),
  p("cudy-wr3000-wifi6", "WR3000 AX3000 dual-band Wi-Fi 6 router", "Cudy", 5500, "1794209266-1cc36e52.jpeg", true),
  p("qcy-urban-gs-smart-watch", "Urban GS smart watch, black", "QCY", 6889, "1794131117-dbc2c470.jpeg", true),
  p("baseus-nomos-nt11", "Nomos NT11 35W power bank, 10000mAh", "Baseus", 4029, "1793796133-b4756731.jpeg", true),
];

export const creatorGear: Product[] = [
  p("fifine-k678", "K678 USB studio condenser microphone", "Fifine", 7200, "1793707080-34e04d1c.jpeg"),
  p("fifine-amplitank-tank3", "AmpliTank Tank3 USB/XLR dynamic mic", "Fifine", 8000, "1793706785-244b6877.jpeg"),
  p("maono-dgm20s", "DGM20S USB gaming mic with noise cancelling", "Maono", 5500, "1793706130-ea151be5.jpg"),
  p("maono-wave-t1-mini", "Wave T1 Mini wireless microphone", "Maono", 4000, "1793705014-09ede6cc.jpeg"),
];

export const underBudget: Product[] = [
  p("geeoo-c22-charger", "C22 22.5W fast Type-C charger set", "Geeoo", 689, "1790246183-0c8ea3a7.png"),
  p("rgb-neck-fan", "Rechargeable neck fan with RGB light", "FindMart pick", 809, "1793431006-71ce6164.jpeg"),
  p("g200-magnetic-speaker", "G200 magnetic Bluetooth speaker", "FindMart pick", 850, "1793432405-52f4ee7c.jpeg"),
  p("lenovo-hd103-pro", "HD103 Pro Bluetooth speaker, white", "Lenovo", 1139, "1793631397-2929afe5.jpg"),
  p("neepho-np-c01", "NP-C01 phone cooling fan", "NeePho", 1209, "1791348911-04936e7d.jpeg"),
  p("kemei-km-2273", "KM-2273 professional hair clipper", "Kemei", 1439, "wp-402570-3c808d65ec.png"),
  p("t15-handheld-fan", "T-15 handheld mini fan", "FindMart pick", 1439, "1793430292-e0c1bde9.png"),
  p("kemei-km-max5090", "KM-MAX5090 hair clipper for men", "Kemei", 1499, "wp-387711-8b1a156322.webp"),
];

export const heroShelf: Product[] = [
  newArrivals[0],
  p("titan-urban-edge-olive", "Urban Edge olive dial leather watch", "Titan", 4829, "wp-229214-baeff8f8bf.jpg"),
  p("hoco-ds89-speaker", "DS89 portable RGB speaker", "Hoco", 4400, "1791439440-533485b3.jpg"),
];

export const solarPick = p(
  "gearup-dc-induction-cooker",
  "GearUP DC induction cooker, 24V 1000W",
  "GearUP",
  12000,
  "1794638966-e104ba46.jpeg",
  true,
);

export type Category = { slug: string; name: string; note: string; image: string };

export const categories: Category[] = [
  { slug: "earbuds-audio", name: "Earbuds & audio", note: "ANC, TWS, neckbands", image: IMG + "1794125263-80d34935.jpeg" },
  { slug: "smart-watches", name: "Smart watches", note: "Calling, fitness, AMOLED", image: IMG + "1794213577-8fca30e1.jpeg" },
  { slug: "wrist-watches", name: "Wrist watches", note: "Titan, Fastrack, quartz", image: IMG + "wp-228944-b28516b79c.webp" },
  { slug: "power-charging", name: "Power & charging", note: "Power banks, GaN chargers", image: IMG + "1789813090-d28d28ac.jpeg" },
  { slug: "creator-gear", name: "Creator gear", note: "Mics, tripods, lights", image: IMG + "1793703245-aeddbea9.jpeg" },
  { slug: "speakers", name: "Speakers", note: "Portable, party, soundbars", image: IMG + "1789293604-522d415b.jpeg" },
  { slug: "home-kitchen", name: "Home & kitchen", note: "Cookers, fans, lamps", image: IMG + "1794638705-04d7a787.jpg" },
  { slug: "grooming", name: "Grooming", note: "Clippers, dryers", image: IMG + "1793187075-225f3cd0.jpeg" },
  { slug: "networking", name: "Networking", note: "Wi-Fi routers, mesh", image: IMG + "1793425400-dcbdf52c.jpeg" },
];

export const brands = ["Hoco", "QCY", "Baseus", "Anker", "Joyroom", "Fifine", "Maono", "Titan", "Fastrack", "Xiaomi", "Ugreen", "Kemei"];

export const taka = (n: number) => "৳" + n.toLocaleString("en-IN");
export const productUrl = (slug: string) => `${SITE}/product/${slug}/`;
export const categoryUrl = (slug: string) => `${SITE}/category/${slug}/`;

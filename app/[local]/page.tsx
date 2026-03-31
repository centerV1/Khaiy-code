
import type { Metadata } from "next";
import {
  CreditCard,
  Download,
  FolderOpenDot,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import KhaiCodeStorefront, {
  type StoreCategory,
  type StoreProduct,
} from "@/components/khai-code-storefront";

type PageProps = Readonly<{
  params: Promise<{ local: string }>;
}>;

type LocalizedText = {
  th: string;
  en: string;
};

type BaseProduct = {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  price: number;
  stack: string;
  license: string;
  eta: string;
  featured?: boolean;
  tagline: LocalizedText;
  description: LocalizedText;
  delivery: LocalizedText;
  includes: LocalizedText[];
};

const categoryContent = {
  th: [
    {
      id: 1,
      name: "Auth & Access",
      description: "หน้า login, social auth และ session state สำหรับคนที่อยากเริ่มขายเร็ว",
    },
    {
      id: 2,
      name: "Payments",
      description: "flow ชำระเงินที่จัดวางให้ซื้อสะดวกและปิดการขายไว",
    },
    {
      id: 3,
      name: "Storefronts",
      description: "หน้าร้านขายไฟล์โค้ด, bundle และ digital product แบบพร้อมใช้",
    },
    {
      id: 4,
      name: "Admin Tools",
      description: "หลังบ้านสำหรับจัดหมวดหมู่, product image และไฟล์ดาวน์โหลด",
    },
  ],
  en: [
    {
      id: 1,
      name: "Auth & Access",
      description: "Login, social auth, and session-ready flows for teams shipping fast.",
    },
    {
      id: 2,
      name: "Payments",
      description: "Checkout patterns designed to reduce friction and close purchase quickly.",
    },
    {
      id: 3,
      name: "Storefronts",
      description: "Digital storefronts for code packs, bundles, and ready-to-ship products.",
    },
    {
      id: 4,
      name: "Admin Tools",
      description: "Back-office surfaces for categories, product images, and file delivery.",
    },
  ],
} satisfies Record<"th" | "en", StoreCategory[]>;

const baseProducts: BaseProduct[] = [
  {
    id: 1,
    slug: "starter-auth-suite",
    name: "Starter Auth Suite",
    categoryId: 1,
    price: 990,
    stack: "Next.js 16, OAuth, Session cookies",
    license: "Single project",
    eta: "15 นาที",
    tagline: {
      th: "ล็อกอินให้ครบในชุดเดียว",
      en: "All-in-one sign-in starter",
    },
    description: {
      th: "โครงหน้าล็อกอินพร้อม email/password, Google และ Facebook ที่จัดวางให้ผู้ใช้เข้าใจทันทีว่าควรทำอะไรต่อ",
      en: "A sign-in foundation with email/password, Google, and Facebook paths arranged for immediate clarity.",
    },
    delivery: {
      th: "ดาวน์โหลด ZIP และ setup note ทันที",
      en: "Instant ZIP download with setup notes",
    },
    includes: [
      { th: "Login / logout UI", en: "Login / logout UI" },
      { th: "Social auth buttons", en: "Social auth buttons" },
      { th: "Protected route pattern", en: "Protected route pattern" },
    ],
  },
  {
    id: 2,
    slug: "creator-checkout-stack",
    name: "Creator Checkout Stack",
    categoryId: 2,
    price: 1490,
    stack: "Checkout UI, cart states, receipt flow",
    license: "Commercial use",
    eta: "30 นาที",
    tagline: {
      th: "หน้าจ่ายเงินสำหรับของดิจิทัล",
      en: "Checkout built for digital goods",
    },
    description: {
      th: "หน้า cart และชำระเงินที่เน้นซื้อไว สรุปรายการชัด และรองรับการส่งต่อเข้า payment session ได้ตรง ๆ",
      en: "A focused cart and checkout flow with clear totals and a direct handoff into a payment session.",
    },
    delivery: {
      th: "พร้อมต่อ payment session ภายหลัง",
      en: "Ready to connect to a payment session",
    },
    includes: [
      { th: "Cart summary rail", en: "Cart summary rail" },
      { th: "Payment status copy", en: "Payment status copy" },
      { th: "Receipt / success state", en: "Receipt / success state" },
    ],
  },
  {
    id: 3,
    slug: "code-market-core",
    name: "Code Market Core",
    categoryId: 3,
    price: 2490,
    stack: "Catalog, category filter, purchase rail",
    license: "Commercial + resale",
    eta: "45 นาที",
    featured: true,
    tagline: {
      th: "หน้าร้านขายโค้ดแบบครบ flow",
      en: "A complete code storefront flow",
    },
    description: {
      th: "เหมาะกับตลาดขาย source code, starter kit หรือ template ที่ต้องการทั้งหน้าร้าน, cart และสถานะดาวน์โหลดหลังซื้อ",
      en: "Best for selling source code, starter kits, or templates with catalog, cart, and post-purchase download states.",
    },
    delivery: {
      th: "ใช้ productId เดิมใน payment payload ได้เลย",
      en: "Keeps product IDs ready for the payment payload",
    },
    includes: [
      { th: "Category browsing", en: "Category browsing" },
      { th: "Purchase history state", en: "Purchase history state" },
      { th: "Instant file unlock mock", en: "Instant file unlock mock" },
    ],
  },
  {
    id: 4,
    slug: "admin-release-console",
    name: "Admin Release Console",
    categoryId: 4,
    price: 1290,
    stack: "Table layouts, status controls, upload surfaces",
    license: "Single team",
    eta: "20 นาที",
    tagline: {
      th: "หลังบ้านจัดสินค้าให้อ่านง่าย",
      en: "A clean admin surface for products",
    },
    description: {
      th: "หน้าควบคุมสำหรับจัดหมวดหมู่, ภาพสินค้า และไฟล์โค้ด โดยเน้นอ่านง่ายและลดการกดหลายครั้ง",
      en: "An admin surface for categories, product images, and file assets with low-friction actions.",
    },
    delivery: {
      th: "เหมาะต่อยอดกับ create / patch product",
      en: "Built to extend into create / patch product flows",
    },
    includes: [
      { th: "Product editing layout", en: "Product editing layout" },
      { th: "Upload placeholder states", en: "Upload placeholder states" },
      { th: "Image management UI", en: "Image management UI" },
    ],
  },
  {
    id: 5,
    slug: "download-vault",
    name: "Download Vault",
    categoryId: 1,
    price: 1190,
    stack: "Account area, purchase locker, delivery notice",
    license: "Commercial use",
    eta: "25 นาที",
    tagline: {
      th: "จัดการไฟล์หลังซื้ออย่างมั่นใจ",
      en: "Post-purchase access that feels secure",
    },
    description: {
      th: "พื้นที่สมาชิกที่รวม purchase history, ไฟล์ดาวน์โหลด และสถานะ license ไว้ในมุมมองเดียว",
      en: "A member area combining purchase history, downloadable files, and license status in one place.",
    },
    delivery: {
      th: "เชื่อมกับ /users/purchases และ /products/purchases/file",
      en: "Maps cleanly to /users/purchases and /products/purchases/file",
    },
    includes: [
      { th: "Download vault UI", en: "Download vault UI" },
      { th: "License notices", en: "License notices" },
      { th: "Member account states", en: "Member account states" },
    ],
  },
  {
    id: 6,
    slug: "bundle-launch-kit",
    name: "Bundle Launch Kit",
    categoryId: 2,
    price: 1890,
    stack: "Bundle pages, tier pricing, launch CTA",
    license: "Commercial use",
    eta: "35 นาที",
    tagline: {
      th: "ขายหลายชุดพร้อมกันโดยไม่รก",
      en: "Bundle offers without visual clutter",
    },
    description: {
      th: "สำหรับตอนที่คุณต้องการขายหลายแพ็กพร้อมกัน แต่ยังอยากให้คนตัดสินใจและเข้า checkout ได้ไว",
      en: "For teams selling multiple packs while keeping comparison and checkout fast and easy.",
    },
    delivery: {
      th: "เหมาะกับ upsell และ launch campaign",
      en: "Designed for upsells and launch campaigns",
    },
    includes: [
      { th: "Bundle pricing blocks", en: "Bundle pricing blocks" },
      { th: "Priority CTA layout", en: "Priority CTA layout" },
      { th: "Upsell support copy", en: "Upsell support copy" },
    ],
  },
];

const pageCopy = {
  th: {
    title: "KhaiCode | หน้าร้านขายโค้ดพร้อมส่ง",
    description: "หน้าบ้านสำหรับขาย source code, template และ digital product โดยยึด flow จากระบบ Auth, Product, Payment และ Purchases ที่มีอยู่",
    skip: "ข้ามไปยังเนื้อหาหลัก",
    navCatalog: "สินค้า",
    navFlow: "วิธีซื้อ",
    navDelivery: "การส่งมอบ",
    brandLabel: "KhaiCode",
    heroEyebrow: "Digital code marketplace",
    heroTitle: "ขายโค้ดให้ชัด ซื้อให้ไว และส่งไฟล์ได้ทันทีหลังชำระ",
    heroBody:
      "ออกแบบหน้าร้านให้เลือกสินค้าได้เร็ว อ่านง่ายบนมือถือ และต่อยอดเข้ากับ auth, payment session และไฟล์ดาวน์โหลดจาก backend ที่คุณมีอยู่แล้ว",
    heroPrimary: "ดูสินค้าพร้อมซื้อ",
    heroSecondary: "ดู flow การส่งมอบ",
    heroMetrics: [
      "เลือกสินค้าได้จากหมวดหมู่เดียวกับ backend",
      "รองรับ login, checkout และ purchase history ใน flow เดียว",
      "เน้น contrast ชัด, tap target ใหญ่ และลดขั้นตอนก่อนจ่ายเงิน",
    ],
    visualLabel: "Purchase preview",
    visualTitle: "from browse to download",
    visualItems: [
      "auth/google/login -> social sign-in",
      "products -> category-ready storefront",
      "payment/payment-session -> checkout handoff",
    ],
    supportHeading: "วางหน้าบ้านให้ตรงกับระบบหลังบ้านที่มีอยู่แล้ว",
    supportBody:
      "โครงหน้าเว็บนี้ใช้ภาษาของ product, category, payment session และ purchase file delivery โดยตรง เพื่อให้ต่อ API ได้ง่ายในรอบถัดไป",
    supportPoints: [
      {
        title: "เลือกสินค้าไว",
        body: "รายการสินค้าเป็นแถวอ่านง่าย พร้อมหมวด, ราคา, stack และไฟล์ที่ได้โดยไม่ต้องกดเข้าไปหลายหน้า",
      },
      {
        title: "จ่ายเงินไม่หลง",
        body: "มี purchase rail ทางขวาให้เห็นยอดรวมชัด และ payload ที่จะส่งเข้า payment session แบบตรงไปตรงมา",
      },
      {
        title: "รับไฟล์ทันที",
        body: "หลังซื้อมีสถานะปลดล็อกไฟล์ให้เห็นชัด เหมาะต่อยอดกับ purchase history และ file download จริง",
      },
    ],
    catalogHeading: "เลือกหมวด ดูรายละเอียด และกดซื้อจากหน้าเดียว",
    catalogBody:
      "ผมทำส่วนนี้เป็น interactive mock เพื่อให้เห็นประสบการณ์ใช้งานจริงแม้ยังไม่เชื่อม API คุณสามารถคัดลอก state และ event handler ไปต่อ backend ได้ทันที",
    workflowHeading: "วิธีซื้อที่สั้นและเข้าใจง่าย",
    workflowBody:
      "ลำดับถูกวางตาม endpoint ที่มีอยู่ เพื่อให้ผู้ใช้เริ่มจากการเลือกสินค้า แล้วไปจบที่ download ได้โดยแทบไม่ต้องตีความ",
    steps: [
      {
        title: "1. Browse",
        body: "ดูสินค้าและกรองตามหมวดที่ backend มีอยู่จริง เช่น auth, payment, storefront และ admin",
      },
      {
        title: "2. Sign in",
        body: "รองรับ email/password หรือ social login โดยแสดงตำแหน่งปุ่มให้เด่นและกดง่ายทั้ง desktop และ mobile",
      },
      {
        title: "3. Checkout",
        body: "สรุปรายการและสร้าง payload สำหรับ `POST /payment/payment-session` โดยใช้ productId ของสินค้าที่เลือก",
      },
      {
        title: "4. Download",
        body: "หลังชำระเงิน ผู้ใช้เห็น purchase history และไฟล์ ZIP ที่ปลดล็อกทันทีจากหน้าบัญชีของตัวเอง",
      },
    ],
    deliveryHeading: "ครอบคลุมการส่งมอบ, ความน่าเชื่อถือ และการกลับมาดาวน์โหลดซ้ำ",
    deliveryBody:
      "ส่วนนี้ช่วยให้ผู้ซื้อมั่นใจว่าจ่ายแล้วไม่หาย และทีมคุณมีจุดชัดเจนสำหรับเชื่อม `/users/me`, `/users/purchases` และ `/products/purchases/file/:id` ภายหลัง",
    deliveryPoints: [
      {
        icon: ShieldCheck,
        title: "ความน่าเชื่อถือ",
        body: "copy และลำดับข้อมูลเน้นบอกให้ชัดว่า login, payment และ download อยู่ตรงไหน ไม่มีข้อความขายเกินความจริง",
      },
      {
        icon: CreditCard,
        title: "พร้อมต่อระบบจ่ายเงินจริง",
        body: "cart summary และ payment payload ถูกแยกชัด เพื่อเสียบเข้ากับ backend payment session ได้สะดวก",
      },
      {
        icon: FolderOpenDot,
        title: "มีพื้นที่สำหรับไฟล์และประวัติซื้อ",
        body: "ออกแบบเผื่อกรณีที่หนึ่งผู้ใช้ซื้อหลายสินค้า และต้องกลับมาดาวน์โหลดซ้ำในภายหลัง",
      },
      {
        icon: LockKeyhole,
        title: "social login เข้าใจง่าย",
        body: "Facebook, Google และ email/password ถูกจัดเป็นทางเข้าเดียวกัน ไม่ทำให้ผู้ใช้สับสนก่อนเริ่มซื้อ",
      },
    ],
    finalHeading: "พร้อมต่อ API เมื่อคุณอยากเริ่มเชื่อมของจริง",
    finalBody:
      "ตอนนี้หน้า frontend ทำงานครบในเชิงประสบการณ์แล้ว ทั้งการเลือกสินค้า, cart, checkout mock และ file unlock state เหลือแค่ผูก endpoint จริงในรอบถัดไป",
    finalPrimary: "เริ่มจาก catalog นี้",
    finalSecondary: "ดูการส่งมอบอีกครั้ง",
    storefront: {
      allCategories: "ทุกหมวด",
      emptyCategory: "ยังไม่มีสินค้าสำหรับหมวดนี้ใน mock set",
      catalogCaption:
        "ทุกแถวถูกจัดให้สแกนได้เร็ว: เริ่มจากหมวดและชื่อสินค้า, ตามด้วยสิ่งที่ได้, stack, license และเวลาพร้อมใช้งาน",
      addLabel: "เพิ่มลง cart",
      removeLabel: "เอาออก",
      includeLabel: "สิ่งที่ได้",
      stackLabel: "Stack",
      licenseLabel: "License",
      etaLabel: "พร้อมใช้ใน",
      summaryTitle: "Cart และ checkout rail",
      summaryBody:
        "โซนนี้ยึดตาม endpoint payment session ที่ backend มีอยู่แล้ว คุณจึงเห็นได้ทันทีว่าหน้าบ้านจะส่งข้อมูลอะไรเข้า flow จ่ายเงิน",
      summaryEmpty: "ยังไม่ได้เลือกสินค้า ลองกดเพิ่มสินค้าจากรายการด้านซ้ายเพื่อดูยอดรวมและ payload สำหรับ checkout",
      paymentLabel: "Payment session",
      totalLabel: "ยอดรวม",
      loginLabel: "รองรับทางเข้า",
      historyLabel: "มีจุดต่อสำหรับ purchase history และดาวน์โหลดซ้ำ",
      loginMethods: ["Email / Password", "Google", "Facebook"],
      checkout: "จำลอง checkout และปลดล็อกไฟล์",
      checkoutHint:
        "ปุ่มนี้ยังไม่เรียก API จริง แต่จำลองสถานะชำระเงินสำเร็จและปลดล็อกไฟล์เพื่อดูประสบการณ์ครบเส้นทาง",
      checkoutDisabled: "เลือกสินค้าก่อน checkout",
      successTitle: "ชำระเงินสำเร็จใน mock flow",
      successBody:
        "ตอนต่อ API จริง คุณสามารถแทนที่ state นี้ด้วย response จาก payment session และ redirect กลับมาที่หน้าประวัติซื้อได้เลย",
      downloadLabel: "พร้อมดาวน์โหลด",
      unlockedTitle: "ไฟล์ที่ปลดล็อกแล้ว",
      unlockedBody:
        "ในระบบจริง รายการนี้สามารถอิงกับ `GET /users/purchases` และ `GET /products/purchases/file/:id` เพื่อแสดงลิงก์ดาวน์โหลดของผู้ใช้แต่ละคน",
      featuredBadge: "ขายดี",
    },
  },
  en: {
    title: "KhaiCode | Ready-to-ship code storefront",
    description:
      "A storefront for selling source code, templates, and digital products built around the existing Auth, Product, Payment, and Purchases flows",
    skip: "Skip to main content",
    navCatalog: "Catalog",
    navFlow: "Flow",
    navDelivery: "Delivery",
    brandLabel: "KhaiCode",
    heroEyebrow: "Digital code marketplace",
    heroTitle: "Sell code with clarity, shorten checkout, and unlock files right after payment",
    heroBody:
      "This frontend is designed around your existing auth, payment session, and file delivery backend so the next API pass stays straightforward.",
    heroPrimary: "Browse the catalog",
    heroSecondary: "See delivery flow",
    heroMetrics: [
      "Category browsing mirrors the backend model",
      "Login, checkout, and purchase history live in one clear flow",
      "Large tap targets and strong contrast keep the path simple on mobile",
    ],
    visualLabel: "Purchase preview",
    visualTitle: "from browse to download",
    visualItems: [
      "auth/google/login -> social sign-in",
      "products -> category-ready storefront",
      "payment/payment-session -> checkout handoff",
    ],
    supportHeading: "A frontend shaped to fit the backend you already have",
    supportBody:
      "The UI uses the same language as your products, categories, payment session, and purchased file delivery so wiring APIs later stays clean.",
    supportPoints: [
      {
        title: "Fast scanning",
        body: "Products are presented in readable rows with price, stack, included files, and category context without forcing extra page hops.",
      },
      {
        title: "Clear checkout",
        body: "A dedicated purchase rail keeps totals visible and shows the exact payload that will move into your payment session.",
      },
      {
        title: "Instant delivery state",
        body: "The post-purchase state makes file access obvious, which is perfect for extending into purchase history and real download URLs.",
      },
    ],
    catalogHeading: "Filter, compare, and buy from one working surface",
    catalogBody:
      "This section is interactive even without APIs, so you can validate the shopping experience now and connect handlers later.",
    workflowHeading: "A short buying flow users understand immediately",
    workflowBody:
      "The order follows the endpoints you already have, so customers move from browsing to download without having to interpret the system.",
    steps: [
      {
        title: "1. Browse",
        body: "Filter across the same backend categories: auth, payment, storefront, and admin.",
      },
      {
        title: "2. Sign in",
        body: "Email/password and social login are grouped into one obvious entry point on desktop and mobile.",
      },
      {
        title: "3. Checkout",
        body: "The cart summary builds the payload for `POST /payment/payment-session` using selected product IDs.",
      },
      {
        title: "4. Download",
        body: "After payment, users land on a purchase history state with unlocked ZIP files tied to their account.",
      },
    ],
    deliveryHeading: "Delivery, trust, and repeat downloads are accounted for",
    deliveryBody:
      "This section leaves clear room for `/users/me`, `/users/purchases`, and `/products/purchases/file/:id` once you are ready to connect the real backend.",
    deliveryPoints: [
      {
        icon: ShieldCheck,
        title: "Trust by structure",
        body: "Copy and layout tell people exactly where sign-in, payment, and download happen without overpromising.",
      },
      {
        icon: CreditCard,
        title: "Ready for real payments",
        body: "The cart summary and payment payload are intentionally separated to make the handoff into payment session simple.",
      },
      {
        icon: FolderOpenDot,
        title: "Built for repeat access",
        body: "The account area anticipates users returning to download multiple products over time.",
      },
      {
        icon: LockKeyhole,
        title: "Social login stays obvious",
        body: "Facebook, Google, and email/password are presented as one clear gateway instead of fragmented entry points.",
      },
    ],
    finalHeading: "Ready for API wiring when you want the next step",
    finalBody:
      "The frontend experience already covers product selection, cart behavior, checkout preview, and file unlock states. The next pass is mainly endpoint integration.",
    finalPrimary: "Start with this catalog",
    finalSecondary: "Review delivery states",
    storefront: {
      allCategories: "All categories",
      emptyCategory: "No mock products are mapped to this category yet.",
      catalogCaption:
        "Each row is designed to scan quickly: category and name first, then included files, stack, license, and time-to-value.",
      addLabel: "Add to cart",
      removeLabel: "Remove",
      includeLabel: "What is included",
      stackLabel: "Stack",
      licenseLabel: "License",
      etaLabel: "Ready in",
      summaryTitle: "Cart and checkout rail",
      summaryBody:
        "This panel mirrors the payment session endpoint you already have, making the frontend-to-backend handoff easy to reason about.",
      summaryEmpty: "No products selected yet. Add items from the list to see totals and the checkout payload.",
      paymentLabel: "Payment session",
      totalLabel: "Total",
      loginLabel: "Supported entry points",
      historyLabel: "Room for purchase history and repeat downloads",
      loginMethods: ["Email / Password", "Google", "Facebook"],
      checkout: "Run mock checkout and unlock files",
      checkoutHint:
        "This button does not call the real API yet. It simulates a paid state so you can validate the complete purchase experience.",
      checkoutDisabled: "Select products before checkout",
      successTitle: "Payment completed in mock flow",
      successBody:
        "When you connect the API, this state can be replaced by the payment response and a redirect back into purchased files.",
      downloadLabel: "Download ready",
      unlockedTitle: "Unlocked files",
      unlockedBody:
        "In production, this list can be powered by `GET /users/purchases` and `GET /products/purchases/file/:id` to show each user's actual download URLs.",
      featuredBadge: "Featured",
    },
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { local } = await params;
  const locale = local === "th" ? "th" : "en";

  return {
    title: pageCopy[locale].title,
    description: pageCopy[locale].description,
  };
}

export default async function Home({ params }: PageProps) {
  const { local } = await params;
  const locale = local === "th" ? "th" : "en";
  const copy = pageCopy[locale];
  const categories = categoryContent[locale];
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const products: StoreProduct[] = baseProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    categoryId: product.categoryId,
    category: categoryById.get(product.categoryId)?.name ?? "",
    tagline: product.tagline[locale],
    description: product.description[locale],
    stack: product.stack,
    license: product.license,
    delivery: product.delivery[locale],
    eta: product.eta,
    price: product.price,
    includes: product.includes.map((item) => item[locale]),
    featured: product.featured,
  }));

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <main id="main-content" className="bg-[color:var(--canvas)] text-[color:var(--ink)]">
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[color:var(--hero)] text-white">
          <div className="ambient-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,190,92,0.26),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(102,236,196,0.16),_transparent_26%)]" />

          <header className="absolute inset-x-0 top-0 z-20">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
              <a
                href="#main-content"
                className="font-heading text-lg font-semibold tracking-[0.24em] text-white"
              >
                {copy.brandLabel}
              </a>
              <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
                <a className="hero-nav-link" href="#catalog">
                  {copy.navCatalog}
                </a>
                <a className="hero-nav-link" href="#workflow">
                  {copy.navFlow}
                </a>
                <a className="hero-nav-link" href="#delivery">
                  {copy.navDelivery}
                </a>
              </nav>
            </div>
          </header>

          <div className="mx-auto grid min-h-svh max-w-7xl items-end gap-14 px-6 pb-10 pt-28 md:px-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:pb-14 lg:pt-32">
            <div className="relative z-10 max-w-xl self-center">
              <div className="animate-rise space-y-7">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {copy.heroEyebrow}
                  </p>
                  <h1 className="font-heading text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                    {copy.heroTitle}
                  </h1>
                  <p className="max-w-lg text-pretty text-base leading-7 text-white/72 sm:text-lg">
                    {copy.heroBody}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a className="action-primary" href="#catalog">
                    {copy.heroPrimary}
                  </a>
                  <a className="action-secondary-on-dark" href="#delivery">
                    {copy.heroSecondary}
                  </a>
                </div>

                <ul className="space-y-3 pt-2 text-sm text-white/70">
                  {copy.heroMetrics.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-[color:var(--accent-soft)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="animate-drift relative flex min-h-[25rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.02))]" />
              <div className="relative flex h-full flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/52">
                      {copy.visualLabel}
                    </p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">
                      {copy.visualTitle}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                    <PackageCheck className="size-4 text-[color:var(--accent-soft)]" />
                    Mock data only
                  </div>
                </div>

                <div className="grid flex-1 gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 font-mono text-sm text-white/78 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs uppercase tracking-[0.22em] text-white/45">
                      <span>KhaiCode.manifest</span>
                      <span>v0.1 frontend</span>
                    </div>
                    <div className="space-y-3">
                      {copy.visualItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                        >
                          <span>{item}</span>
                          <span className="size-2 rounded-full bg-[color:var(--accent-soft)]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <LockKeyhole className="size-5 text-[color:var(--accent-soft)]" />
                      <p className="mt-5 text-sm uppercase tracking-[0.22em] text-white/52">
                        Auth
                      </p>
                      <p className="mt-2 text-base text-white/78">
                        Email, Google, Facebook
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <ShoppingBag className="size-5 text-[color:var(--accent-soft)]" />
                      <p className="mt-5 text-sm uppercase tracking-[0.22em] text-white/52">
                        Cart
                      </p>
                      <p className="mt-2 text-base text-white/78">
                        Product IDs ready for payment
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <Download className="size-5 text-[color:var(--accent-soft)]" />
                      <p className="mt-5 text-sm uppercase tracking-[0.22em] text-white/52">
                        Files
                      </p>
                      <p className="mt-2 text-base text-white/78">
                        Purchase history and ZIP unlock state
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-[color:var(--canvas)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 lg:grid-cols-[minmax(0,28rem)_1fr]">
            <div className="space-y-5">
              <p className="section-kicker">Aligned with backend</p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
                {copy.supportHeading}
              </h2>
              <p className="max-w-xl text-base leading-7 text-[color:var(--muted-ink)]">
                {copy.supportBody}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {copy.supportPoints.map((point) => (
                <div
                  key={point.title}
                  className="border-t border-[color:var(--line-strong)] pt-5"
                >
                  <p className="font-heading text-xl font-semibold tracking-tight text-[color:var(--ink)]">
                    {point.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted-ink)]">
                    {point.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="catalog"
          className="mx-auto max-w-7xl scroll-mt-20 px-6 py-16 md:px-8 lg:py-20"
        >
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="section-kicker">Interactive catalog</p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
              {copy.catalogHeading}
            </h2>
            <p className="text-base leading-7 text-[color:var(--muted-ink)]">
              {copy.catalogBody}
            </p>
          </div>

          <KhaiCodeStorefront
            categories={categories}
            products={products}
            locale={locale}
            copy={copy.storefront}
          />
        </section>

        <section
          id="workflow"
          className="border-y border-[color:var(--line)] bg-[color:var(--paper)]/70 scroll-mt-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:py-20">
            <div className="space-y-5">
              <p className="section-kicker">Purchase flow</p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
                {copy.workflowHeading}
              </h2>
              <p className="text-base leading-7 text-[color:var(--muted-ink)]">
                {copy.workflowBody}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {copy.steps.map((step) => (
                <div
                  key={step.title}
                  className="surface-panel min-h-[13rem] p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted-ink)]">
                    {step.title}
                  </p>
                  <p className="mt-5 text-base leading-7 text-[color:var(--ink)]">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="delivery"
          className="mx-auto max-w-7xl scroll-mt-20 px-6 py-16 md:px-8 lg:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,28rem)_1fr]">
            <div className="space-y-5">
              <p className="section-kicker">Delivery design</p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
                {copy.deliveryHeading}
              </h2>
              <p className="text-base leading-7 text-[color:var(--muted-ink)]">
                {copy.deliveryBody}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {copy.deliveryPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.title}
                    className="border-t border-[color:var(--line-strong)] pt-6"
                  >
                    <Icon className="size-5 text-[color:var(--accent)]" />
                    <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[color:var(--muted-ink)]">
                      {point.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--line)] bg-[color:var(--hero)] text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
              <div className="space-y-5">
                <p className="section-kicker text-white/50">Next step</p>
                <h2 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {copy.finalHeading}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-white/70">
                  {copy.finalBody}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <a className="action-primary" href="#catalog">
                  {copy.finalPrimary}
                </a>
                <a className="action-secondary-on-dark" href="#delivery">
                  {copy.finalSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

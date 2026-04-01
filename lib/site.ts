import type {
  AppLocale,
  CartProductSnapshot,
  ProductSummary,
} from "@/lib/types/store";

type CopyValue = {
  brand: string;
  nav: {
    home: string;
    products: string;
    sell: string;
    profile: string;
    login: string;
    signup: string;
    cart: string;
    logout: string;
  };
  common: {
    browse: string;
    checkout: string;
    addToCart: string;
    added: string;
    viewDetails: string;
    dashboard: string;
    emptyState: string;
    save: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    featuredTitle: string;
    featuredDescription: string;
    categoryTitle: string;
    categoryDescription: string;
    sellerTitle: string;
    sellerDescription: string;
    finalTitle: string;
    finalDescription: string;
  };
  products: {
    title: string;
    description: string;
    searchPlaceholder: string;
    filterAll: string;
    showingLabel: string;
    noResultsTitle: string;
    noResultsDescription: string;
  };
  sell: {
    title: string;
    description: string;
    guestTitle: string;
    guestDescription: string;
    guestCta: string;
    formTitle: string;
    formDescription: string;
    listingsTitle: string;
    listingsDescription: string;
    submit: string;
    submitting: string;
    fields: {
      nameTh: string;
      nameEn: string;
      descriptionTh: string;
      descriptionEn: string;
      price: string;
      file: string;
      images: string;
      categories: string;
    };
  };
  profile: {
    title: string;
    description: string;
    guestTitle: string;
    guestDescription: string;
    guestCta: string;
    purchasesTitle: string;
    purchasesDescription: string;
    download: string;
    purchasedOn: string;
    ownedLabel: string;
  };
  auth: {
    loginTitle: string;
    loginDescription: string;
    signupTitle: string;
    signupDescription: string;
    email: string;
    password: string;
    submitLogin: string;
    submitSignup: string;
    pending: string;
    swapToLogin: string;
    swapToSignup: string;
    continueWithGoogle: string;
    continueWithFacebook: string;
    orContinueWithEmail: string;
  };
  cart: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    authNotice: string;
    loginToCheckout: string;
    subtotal: string;
    remove: string;
  };
};

const copy: Record<AppLocale, CopyValue> = {
  en: {
    brand: "Khaiy Code",
    nav: {
      home: "Home",
      products: "Product",
      sell: "Sell",
      profile: "Profile",
      login: "Login",
      signup: "Signup",
      cart: "Cart",
      logout: "Logout",
    },
    common: {
      browse: "Browse products",
      checkout: "Checkout",
      addToCart: "Add to cart",
      added: "In cart",
      viewDetails: "View details",
      dashboard: "Dashboard",
      emptyState: "Nothing here yet",
      save: "Save",
    },
    home: {
      eyebrow: "Marketplace for premium source code",
      title: "Ship polished code products with a storefront that feels ready for launch.",
      description:
        "Discover premium templates, starter kits, dashboards, and production-ready code packs built for teams that want to move fast.",
      primaryCta: "Explore products",
      secondaryCta: "Start selling",
      featuredTitle: "Featured code releases",
      featuredDescription:
        "High-clarity digital products with strong previews, seller trust, and fast checkout flow.",
      categoryTitle: "Built for popular stacks",
      categoryDescription:
        "Organize digital assets by framework, workflow, and use case so buyers can scan fast.",
      sellerTitle: "Made for solo builders and product teams",
      sellerDescription:
        "Upload source files, manage previews, and keep your marketplace footprint clean as the catalog grows.",
      finalTitle: "Turn internal quality into a storefront advantage",
      finalDescription:
        "Launch your own code marketplace, keep the catalog curated, and add more commerce features later without rebuilding the foundation.",
    },
    products: {
      title: "Product catalog",
      description:
        "Browse premium code assets, filter by category, and add what you need before signing in.",
      searchPlaceholder: "Search templates, dashboards, starter kits...",
      filterAll: "All categories",
      showingLabel: "products available",
      noResultsTitle: "No products matched your filters",
      noResultsDescription:
        "Try another keyword or switch back to a wider category view.",
    },
    sell: {
      title: "Sell your code",
      description:
        "Upload digital products, attach previews, and keep your seller workflow simple from day one.",
      guestTitle: "Sign in before listing products",
      guestDescription:
        "Your seller workspace uses your account session so you can manage products and orders later.",
      guestCta: "Go to login",
      formTitle: "New listing",
      formDescription:
        "Keep product naming clean, describe the use case clearly, and upload the final source file.",
      listingsTitle: "Your current listings",
      listingsDescription:
        "A simple seller view for today, with room for analytics and order tools later.",
      submit: "Publish product",
      submitting: "Publishing...",
      fields: {
        nameTh: "Name (TH)",
        nameEn: "Name (EN)",
        descriptionTh: "Description (TH)",
        descriptionEn: "Description (EN)",
        price: "Price",
        file: "ZIP source file",
        images: "Preview images",
        categories: "Categories",
      },
    },
    profile: {
      title: "Your library",
      description:
        "Review account status, purchased products, and download the code you already own.",
      guestTitle: "Your library opens after login",
      guestDescription:
        "Sign in to view purchased products, download files, and manage your account.",
      guestCta: "Login to continue",
      purchasesTitle: "Purchased products",
      purchasesDescription:
        "Every completed checkout appears here with direct download access.",
      download: "Download file",
      purchasedOn: "Purchased on",
      ownedLabel: "Owned",
    },
    auth: {
      loginTitle: "Welcome back",
      loginDescription:
        "Login to keep your cart, complete checkout, and manage your purchased library.",
      signupTitle: "Create your account",
      signupDescription:
        "Start with a simple account now and layer in richer commerce features later.",
      email: "Email",
      password: "Password",
      submitLogin: "Login",
      submitSignup: "Create account",
      pending: "Please wait...",
      swapToLogin: "Already have an account?",
      swapToSignup: "Need an account?",
      continueWithGoogle: "Continue with Google",
      continueWithFacebook: "Continue with Facebook",
      orContinueWithEmail: "Or continue with email",
    },
    cart: {
      title: "Cart",
      description:
        "Your selected code products stay here even if you login later.",
      emptyTitle: "Cart is empty",
      emptyDescription:
        "Add a few products first. Your selection will stay with you on this device.",
      authNotice: "Checkout requires login, but your cart will stay intact.",
      loginToCheckout: "Login to checkout",
      subtotal: "Subtotal",
      remove: "Remove",
    },
  },
  th: {
    brand: "Khaiy Code",
    nav: {
      home: "หน้าแรก",
      products: "สินค้า",
      sell: "ขาย",
      profile: "โปรไฟล์",
      login: "เข้าสู่ระบบ",
      signup: "สมัครสมาชิก",
      cart: "ตะกร้า",
      logout: "ออกจากระบบ",
    },
    common: {
      browse: "ดูสินค้า",
      checkout: "ชำระเงิน",
      addToCart: "เพิ่มลงตะกร้า",
      added: "อยู่ในตะกร้า",
      viewDetails: "ดูรายละเอียด",
      dashboard: "แดชบอร์ด",
      emptyState: "ยังไม่มีข้อมูล",
      save: "บันทึก",
    },
    home: {
      eyebrow: "Marketplace สำหรับขาย source code คุณภาพสูง",
      title: "สร้างหน้าร้านขายโค้ดที่พร้อมใช้งานจริงตั้งแต่วันแรก",
      description:
        "รวมเทมเพลต, starter kit, dashboard และชุดโค้ดที่พร้อมนำไปใช้งานหรือพัฒนาต่อได้ทันที",
      primaryCta: "ดูสินค้าทั้งหมด",
      secondaryCta: "เริ่มขายโค้ด",
      featuredTitle: "สินค้าที่น่าสนใจ",
      featuredDescription:
        "โชว์ผลงานดิจิทัลด้วยโครงหน้าร้านที่อ่านง่าย ดูน่าเชื่อถือ และพร้อมต่อยอดการขาย",
      categoryTitle: "จัดหมวดตาม stack ที่นิยม",
      categoryDescription:
        "ช่วยให้ผู้ซื้อหา asset ที่ต้องการได้เร็วขึ้นด้วยหมวดที่ชัดและข้อมูลที่สแกนง่าย",
      sellerTitle: "เหมาะทั้งนักพัฒนาเดี่ยวและทีมสินค้า",
      sellerDescription:
        "อัปโหลด source file, ใส่รูป preview และจัดการรายการขายได้ง่ายโดยไม่ทำให้ระบบซับซ้อนเกินไป",
      finalTitle: "เปลี่ยนคุณภาพงานภายในให้กลายเป็นหน้าร้านที่ขายได้จริง",
      finalDescription:
        "เริ่มจาก marketplace ที่เรียบแต่แข็งแรง แล้วค่อยเพิ่มฟีเจอร์อย่างรีวิว, analytics หรือโปรโมชั่นภายหลังได้ง่าย",
    },
    products: {
      title: "แคตตาล็อกสินค้า",
      description:
        "ค้นหาโค้ดที่ต้องการ กรองตามหมวด และเพิ่มลงตะกร้าได้ทันทีแม้ยังไม่ได้ล็อกอิน",
      searchPlaceholder: "ค้นหา template, dashboard, starter kit...",
      filterAll: "ทุกหมวดหมู่",
      showingLabel: "รายการที่พร้อมขาย",
      noResultsTitle: "ยังไม่พบสินค้าตามเงื่อนไขนี้",
      noResultsDescription:
        "ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่แบบกว้างขึ้นอีกนิด",
    },
    sell: {
      title: "ขายโค้ดของคุณ",
      description:
        "ลงสินค้าแบบเป็นระบบ อัปโหลดไฟล์จริง พร้อมภาพ preview และเตรียมร้านให้โตต่อได้ง่าย",
      guestTitle: "เข้าสู่ระบบก่อนเริ่มลงสินค้า",
      guestDescription:
        "seller workspace จะผูกกับบัญชีของคุณ เพื่อให้จัดการรายการขายและออเดอร์ได้ในภายหลัง",
      guestCta: "ไปหน้าเข้าสู่ระบบ",
      formTitle: "ลงสินค้าชิ้นใหม่",
      formDescription:
        "ตั้งชื่อให้ชัด อธิบาย use case ให้ครบ และอัปโหลด source file เวอร์ชันที่พร้อมขาย",
      listingsTitle: "สินค้าที่คุณลงขาย",
      listingsDescription:
        "มุมมองผู้ขายแบบเรียบง่ายในตอนนี้ และยังขยายเป็น seller dashboard เต็มรูปแบบได้ภายหลัง",
      submit: "เผยแพร่สินค้า",
      submitting: "กำลังเผยแพร่...",
      fields: {
        nameTh: "ชื่อสินค้า (TH)",
        nameEn: "ชื่อสินค้า (EN)",
        descriptionTh: "รายละเอียด (TH)",
        descriptionEn: "รายละเอียด (EN)",
        price: "ราคา",
        file: "ไฟล์ ZIP",
        images: "รูป preview",
        categories: "หมวดหมู่",
      },
    },
    profile: {
      title: "คลังสินค้าที่ซื้อแล้ว",
      description:
        "ดูสถานะบัญชี รายการที่ซื้อสำเร็จ และดาวน์โหลด source code ที่เป็นของคุณได้จากที่นี่",
      guestTitle: "คลังสินค้าจะเปิดหลังจากเข้าสู่ระบบ",
      guestDescription:
        "เข้าสู่ระบบเพื่อดูสินค้าที่ซื้อไว้ ดาวน์โหลดไฟล์ และจัดการบัญชีของคุณ",
      guestCta: "เข้าสู่ระบบเพื่อดำเนินการต่อ",
      purchasesTitle: "สินค้าที่ซื้อแล้ว",
      purchasesDescription:
        "ทุกคำสั่งซื้อที่ชำระสำเร็จจะอยู่ในคลังนี้พร้อมลิงก์ดาวน์โหลด",
      download: "ดาวน์โหลดไฟล์",
      purchasedOn: "ซื้อเมื่อ",
      ownedLabel: "เป็นเจ้าของแล้ว",
    },
    auth: {
      loginTitle: "ยินดีต้อนรับกลับ",
      loginDescription:
        "เข้าสู่ระบบเพื่อเก็บตะกร้าไว้ต่อ ชำระเงิน และจัดการคลังสินค้าที่ซื้อแล้ว",
      signupTitle: "สร้างบัญชีของคุณ",
      signupDescription:
        "เริ่มจากระบบสมาชิกที่เรียบง่าย แล้วค่อยต่อยอดฟีเจอร์ร้านค้าเพิ่มได้ภายหลัง",
      email: "อีเมล",
      password: "รหัสผ่าน",
      submitLogin: "เข้าสู่ระบบ",
      submitSignup: "สมัครสมาชิก",
      pending: "กรุณารอสักครู่...",
      swapToLogin: "มีบัญชีอยู่แล้ว?",
      swapToSignup: "ยังไม่มีบัญชี?",
      continueWithGoogle: "เข้าสู่ระบบด้วย Google",
      continueWithFacebook: "เข้าสู่ระบบด้วย Facebook",
      orContinueWithEmail: "หรือใช้อีเมลต่อ",
    },
    cart: {
      title: "ตะกร้าสินค้า",
      description:
        "สินค้าที่คุณเลือกไว้จะยังอยู่ แม้จะไปล็อกอินทีหลัง",
      emptyTitle: "ตะกร้ายังว่างอยู่",
      emptyDescription:
        "ลองเพิ่มสินค้าเข้าไปก่อน รายการจะถูกเก็บไว้บนอุปกรณ์นี้",
      authNotice: "ต้องเข้าสู่ระบบก่อนชำระเงิน แต่สินค้าที่เลือกไว้จะยังอยู่ครบ",
      loginToCheckout: "เข้าสู่ระบบเพื่อชำระเงิน",
      subtotal: "ยอดรวม",
      remove: "ลบออก",
    },
  },
};

const STORE_CURRENCY = process.env.NEXT_PUBLIC_STORE_CURRENCY ?? "USD";

export function getSiteCopy(locale: string) {
  return copy[normalizeLocale(locale)];
}

export function normalizeLocale(locale: string): AppLocale {
  return locale === "th" ? "th" : "en";
}

export function withLocale(locale: string, pathname = "/") {
  const safePath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${normalizeLocale(locale)}${safePath === "/" ? "" : safePath}`;
}

export function getProductName(product: ProductSummary, locale: string) {
  return normalizeLocale(locale) === "th" ? product.name_th : product.name_en;
}

export function getProductDescription(product: ProductSummary, locale: string) {
  return normalizeLocale(locale) === "th"
    ? product.description_th
    : product.description_en;
}

export function getCategoryName(
  category: { name_th: string; name_en: string },
  locale: string,
) {
  return normalizeLocale(locale) === "th" ? category.name_th : category.name_en;
}

export function getPrimaryImage(product: ProductSummary) {
  return (
    product.images.find((image) => image.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl ??
    null
  );
}

export function toCartSnapshot(
  product: ProductSummary,
  locale: string,
): CartProductSnapshot {
  return {
    productId: product.id,
    name: getProductName(product, locale),
    description: getProductDescription(product, locale),
    price: product.price,
    imageUrl: getPrimaryImage(product),
    sellerEmail: product.user.email,
    categories: product.category.map((item) => getCategoryName(item, locale)),
  };
}

export function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: STORE_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

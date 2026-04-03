import { getLocale } from "next-intl/server";

export async function getTranslate() {
  const locale = await getLocale();

  return <T extends object>(item: T, baseKey: string): string => {
    const record = item as Record<string, unknown>;
    const localizedKey = `${baseKey}_${locale}`;
    const englishKey = `${baseKey}_en`;

    const localizedValue = record[localizedKey];
    const englishValue = record[englishKey];
    const fallbackValue = record[baseKey];

    if (typeof localizedValue === "string" && localizedValue !== "") {
      return localizedValue;
    }
    if (typeof englishValue === "string" && englishValue !== "") {
      return englishValue;
    }
    if (typeof fallbackValue === "string" && fallbackValue !== "") {
      return fallbackValue;
    }

    return "";
  };
}

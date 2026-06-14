import { cookies } from "next/headers";

export async function getLanguage() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value;
    return lang || "en";
}

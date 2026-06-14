import PageBanner from "@/Components/homeimg"
import api from "@/lib/api"
import { getLanguage } from "@/lib/lang"
import PopularProduct from "@/Components/Homepage/popularProduct"

import WhyChoose from "@/Components/Homepage/whychoose"
import HeroInfo from "@/Components/Homepage/heroinfo"
import Reyting from "@/Components/Reyting"
import Compani from "@/Components/Homepage/companies"
export default async function Home() {
  const lang = await getLanguage();

  let resheroinfo = {};
  let resproducts = [];
  let reswhychoose = [];
  let rescompani = [];

  try {
    const [
      heroinfo,
      products,
      whychoose,
      compani
    ] = await Promise.all([
      api.get(`hero-info/?lang=${lang}`),
      api.get(`popular-items/?lang=${lang}`),
      api.get(`why-choose-us/?lang=${lang}`),
      api.get("companies/")
    ]);

    resheroinfo = heroinfo?.data?.[0] || {};
    resproducts = products?.data || [];
    reswhychoose = whychoose?.data || [];
    rescompani = compani?.data || [];
  } catch (error) {
    console.error("Error fetching homepage data:", error.message);
  }

  return (
    <div>
      <PageBanner />
      <HeroInfo heroinfo={resheroinfo} />

      <PopularProduct products={resproducts} />
      <Reyting />
      <Compani compani={rescompani} />
      <WhyChoose whychoose={reswhychoose} />
    </div>
  )
}

import React from 'react'
import api from '@/lib/api'
import PageBanner from '@/Components/homeimg'
import { getLanguage } from '@/lib/lang'
import Product from '@/Components/Packpages/product'
import PopularProduct from '@/Components/Homepage/popularProduct'
import Reyting from '@/Components/Reyting'
export default async function Index(props) {
  const searchParams = await props.searchParams;
  const lang = await getLanguage();

  const searchQuery = searchParams?.search || '';
  const minPrice = searchParams?.min_price || '';
  const maxPrice = searchParams?.max_price || '';


  let productsEndpoint = `products/?lang=${lang}`;
  if (searchQuery) {
    productsEndpoint += `&search=${searchQuery}`;
  }
  if (minPrice) {
    productsEndpoint += `&min_price=${minPrice}`;
  }
  if (maxPrice) {
    productsEndpoint += `&max_price=${maxPrice}`;
  }


  const resdata = await api.get(productsEndpoint);
  const respopular = await api.get(`popular-items/?lang=${lang}`);
  return (
    <div>
      <PageBanner title="packages" />
      <Product products={resdata.data} />
      <Reyting />
      <PopularProduct products={respopular.data} />

    </div>
  )
}

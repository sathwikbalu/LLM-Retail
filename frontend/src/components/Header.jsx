import React from 'react'
import { useGetTopProductsQuery } from '../redux/api/productApiSlice'
import Loader from './Loader'
import SmallProduct from '../pages/Products/SmallProduct'
import ProductCarousel from '../pages/Products/ProductCarousel'



const Header = () => {
    const{data,isLoading,error}=useGetTopProductsQuery()

    if(isLoading){
        return<Loader/>
    }
    if(error){
        return <h1>ERROR</h1>
    }

    console.log(data)
  return (
    <>
    <div className="flex justify-around">
        <div className="xl:block lg:hidden:sm:hidden">
            <div className="grid grid-cols-2 gap-6 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                {data.map((product)=>(
                    <div key={product._id}>
                       <SmallProduct product={product}/>
                    </div>
                ))}
            </div>

        </div>
        <ProductCarousel className="sm:hidden md:hidden" />
    </div>
    </>
  )
}

export default Header
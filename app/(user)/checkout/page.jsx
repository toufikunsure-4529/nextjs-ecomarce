"use client"
import { useAuth } from '@/context/AuthContext'
import { useProductsByIds } from '@/lib/firestore/products/read'
import { useUser } from '@/lib/firestore/user/read'
import { CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Checkout from './components/Checkout'

function page() {
    const { user } = useAuth()
    const { data } = useUser({ uid: user?.uid })
    const searchParams = useSearchParams()
    const type = searchParams.get("type")
    const productId = searchParams.get("productId")

    const productIdsList = (type === "buynow") ? [productId] : data?.carts?.map((item) => item?.id)

    const { data: products, error, isLoading } = useProductsByIds({ idsList: productIdsList })

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-100">
                <CircularProgress size={50} thickness={4} color="primary" />
                <p className="mt-4 text-gray-600 font-medium">Fetching...</p>
            </div>
        );
    }


    if (error) {
        return <div>{error.message}</div>
    }

    if (!productIdsList || productIdsList.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Products Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find any products matching your search.</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        )
    }
    const productList = (type === "buynow") ? [
        {
            id: productId,
            quantity: 1,
            product: products[0]
        }
    ] : data?.carts?.map((item) => {
        return {
            ...item,
            product: products?.find((e) => e?.id === item?.id)
        }
    })

    return (
        <main className="p-5 flex flex-col gap-4 min-h-screen pb-16">
            <h2 className='text-xl'>Checkout</h2>
            <Checkout productList={productList} />
        </main>
    )
}

export default page
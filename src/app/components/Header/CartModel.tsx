"use client"
import { CartContext } from '@/app/context/Cart/CartContext'
import React, { Ref, useContext, useEffect } from 'react'
import CartItem from '../CartItem'
import { UserContext } from '@/app/context/User/UserContext'
import Link from 'next/link'
import axios from 'axios'
import { orderRoute, transactionRoute } from '@/lib/routeProvider'
import { useRouter } from 'next/navigation'

const CartModel = ({ cartRef }: { cartRef: Ref<HTMLDivElement> }) => {

  const { cart, setCart } = useContext(CartContext)
  const { user } = useContext(UserContext)
  const router = useRouter();
  let amount = 0;

  const TotalPrice = () => {
    for (let i = 0; i < cart.length; i++) {
      amount += cart[i].product.price * cart[i].qty;

    }
    return amount;
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);



  const Checkout = async () => {
    const response = await axios.post(transactionRoute, { userId: user._id, amount })
    if (response.data.status) {
      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "VibeCart",
        order_id: response.data.orderId,
        handler: async function (response: any) {
          const razorpay_paymentId = response.razorpay_payment_id
          const razorpay_orderId = response.razorpay_order_id
          const razorpay_signature = response.razorpay_signature


          const res = await axios.post(orderRoute, {
            razorpay_orderId,
            razorpay_paymentId,
            razorpay_signature,
            userId: user._id,
            amount
          })

          if (res.data.status) {
            setCart([])
            router.push("/orders")
          }
          else {
            console.log(res.data.error)
          }

        },
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  }

  return (
    <div ref={cartRef} className=' w-[410px] absolute flex flex-col gap-3 top-12 right-0 p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bg-white'>
      <p className=' text-xl font-medium'>Shopping Cart</p>
      {
        !user._id &&
        <div className=" p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50">
          <span className="font-medium">To complete your purchase, Please sign in.</span>
        </div>
      }
      <div className=' flex flex-col w-full gap-4'>
        {cart && cart.map(item => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>
      <div className=' w-full flex flex-col gap-4'>
        <div className=' w-full flex items-center justify-between'>
          <p className=' text-xl font-medium'>Subtotal</p>
          <p className=' text-xl font-semibold'>₹{TotalPrice()}</p>
        </div>
        <div className=' w-full flex items-center justify-between'>
          <Link href={"/cart"}><button className='font-medium p-3 rounded-md border border-gray-400'>View cart</button></Link>
          <button onClick={() => { Checkout() }} disabled={user._id && cart.length >= 1 ? false : true} className='font-medium p-3 rounded-md text-white bg-black disabled:bg-gray-700 disabled:cursor-not-allowed'>Check out</button>
        </div>
      </div>
    </div>
  )
}

export default CartModel
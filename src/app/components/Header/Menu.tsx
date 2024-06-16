"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";

const Menu = () => {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <button onClick={() => (setOpen(!open))}>
                <GiHamburgerMenu className=' text-3xl' />
            </button>
            {open && (
                <div className=' absolute bg-black text-white top-20 left-0 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-lg p-10 z-20'>
                    <Link href={"/"}>Homepage</Link>
                    <Link href={"/"}>Shop</Link>
                    <Link href={"/"}>Deals</Link>
                    <Link href={"/"}>About</Link>
                    <Link href={"/"}>Contact</Link>
                    <Link href={"/"}>Logout</Link>
                    <Link href={"/"}>Cart(1)</Link>
                </div>
            )}
        </div>
    )
}

export default Menu
import Link from 'next/link'
import React from 'react'
import "@radix-ui/themes/styles.css";

const NavBar = () => {
  return (
    <nav className='flex'>
        <Link href="/">Logo</Link>
        <Link href="/shifts">Shift Manager</Link>
        <Link href="/invoices">Invoices</Link>
    </nav>
  )
}

export default NavBar
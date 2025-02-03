import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <nav className='flex'>
        <Link href="/">Logo</Link>
        <ul>
            <li><Link href="/shifts">Shift Manager</Link></li>
            <li><Link href="/invoices">Invoices</Link></li>
        </ul>
    </nav>
  )
}

export default NavBar
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <header>
        <nav>
            <div className="logo">
                <Link href="/" >
                    <Image src="/vercel.svg" alt='' width={40} height={40} />
                </Link>
                
            </div>
            <div className="nav-links">
                <Link href="/">Home</Link>
                <br />
                <Link href="/about">About</Link>
                <br />
                <Link href="/dashboard">Dashboard</Link>
                <br />
                <Link href="/dashboard/courses">Courses</Link>
                <br />
                <Link href="/dashboard/students">Students</Link>
            </div>
        </nav>
    </header>
  )
}

export default Navbar
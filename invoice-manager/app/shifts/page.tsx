import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ShiftView = () => {
  return (
    <>
    <div><Button><Link href='shifts/new'>New Shift</Link></Button></div>
    </>
  )
}

export default ShiftView
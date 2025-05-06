"use client"
import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('../../components/trip'),
  { ssr: false }
)
 
export default function Page() {
  return (
    <div>
      
      <DynamicComponentWithNoSSR />
    </div>
  )
}
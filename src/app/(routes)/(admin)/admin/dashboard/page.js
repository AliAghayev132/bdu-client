import React from 'react'
import AdminPageHeader from '../(components)/AdminPageHeader'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
      <div className="">
      <AdminPageHeader
        title="Xəbərlər"
        action={
          <Link href={{ pathname: "/admin/dashboard/yeni/xeberler", query: { page: "" } }} className='flex items-center gap-2 px-4 py-2 bg-white text-secondary'>
            <PlusIcon size={16}   />
            Yeni xəbər
          </Link>
        }
      />
      <main className='admin-wrapper'>
      
      </main>
      </div>
  )
}

export default page

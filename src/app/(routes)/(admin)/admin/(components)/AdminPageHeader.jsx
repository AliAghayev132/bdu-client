'use client'
import React from 'react'

const AdminPageHeader = ({ title, action }) => {
  return (
    <header className="w-full py-4 bg-primary px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  )
}

export default AdminPageHeader

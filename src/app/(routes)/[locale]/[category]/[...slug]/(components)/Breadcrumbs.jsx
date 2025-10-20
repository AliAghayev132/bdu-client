import { Link } from '@/i18n/routing';
import React from 'react'

const Breadcrumbs = ({breadcrumbs}) => {
  return (
   <div className=" py-3">
          <div className="wrapper mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {/* First item (Home) is link, second item (Category) is text, last item is current page */}
                  {index === 1 ? (
                    <span
                      className="text-gray-600 hover:text-primary"
                    >
                      {crumb.label}
                    </span>
                  ) : index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-600 hover:text-primary"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
  )
}

export default Breadcrumbs

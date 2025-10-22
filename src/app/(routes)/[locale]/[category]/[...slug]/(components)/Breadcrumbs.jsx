import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import React from 'react'

const Breadcrumbs = ({breadcrumbs}) => {
  return (
   <div className="py-3">
          <div className="wrapper mx-auto px-4">
            <nav className="flex items-center flex-wrap sm:space-x-2 space-x-1 md:text-base sm:text-sm text-xs">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center mb-1">
                  {index > 0 && (
                   <ChevronRight size={16} className="text-gray-400 mr-1" />
                  )}
                  {/* First item (Home) is link, second item (Category) is text, last item is current page */}
                  {index === 1 ? (
                    <span
                      className="laptop:text-base  sm:text-sm text-xs text-gray-600 hover:text-primary"
                    >
                      {crumb.label}
                    </span>
                  ) : index === breadcrumbs.length - 1 ? (
                    <span className="laptop:text-base sm:text-sm text-xs text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="laptop:text-base sm:text-sm text-xs text-gray-600 hover:text-primary"
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

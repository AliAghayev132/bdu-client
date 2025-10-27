import React from 'react'
import NewsCard from '../../../(home)/(components)/NewsCard'

const NewsList = ({news}) => {
  return (
    <div className='grid laptop:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 gap-3 py-4'>
      {news.map((item) => (
        <div key={item.id}>
          <NewsCard news={item} />
        </div>
      ))}
    </div>
  )
}

export default NewsList

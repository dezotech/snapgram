const GridPostSkeleton = () => {
  return (
    <ul className="grid-container">
      {Array.from({ length: 9 }).map((_, index) => (
        <li
          key={`skeleton-${index}`}
          className="relative min-w-80 h-80 bg-dark-4 rounded-[24px] animate-pulse"
        >
          <div className="absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 to-transparent rounded-b-[24px] gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-dark-3" />
              <div className="h-3 w-16 bg-dark-3 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-5 bg-dark-3 rounded" />
              <div className="w-5 h-5 bg-dark-3 rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostSkeleton

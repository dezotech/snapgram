const CreatorCardSkeleton = () => {
  return (
    <div className="user-card animate-pulse">
      <div className="rounded-full w-14 h-14 bg-dark-4" />
      <div className="flex-center flex-col gap-2">
        <div className="h-4 w-20 bg-dark-4 rounded" />
        <div className="h-3 w-16 bg-dark-4 rounded" />
      </div>
      <div className="h-8 w-20 bg-dark-4 rounded-lg" />
    </div>
  )
}

export default CreatorCardSkeleton

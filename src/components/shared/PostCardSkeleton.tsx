const PostCardSkeleton = () => {
  return (
    <div className="post-card animate-pulse">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full w-12 h-12 bg-dark-4" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-dark-4 rounded" />
            <div className="h-3 w-32 bg-dark-4 rounded" />
          </div>
        </div>
        <div className="w-5 h-5 bg-dark-4 rounded" />
      </div>
      <div className="py-5">
        <div className="h-4 w-full bg-dark-4 rounded mb-2" />
        <div className="h-4 w-3/4 bg-dark-4 rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-3 w-12 bg-dark-4 rounded" />
          <div className="h-3 w-12 bg-dark-4 rounded" />
          <div className="h-3 w-12 bg-dark-4 rounded" />
        </div>
      </div>
      <div className="w-full h-64 lg:h-[450px] bg-dark-4 rounded-[24px]" />
      <div className="flex justify-between items-center mt-5">
        <div className="flex gap-2">
          <div className="w-5 h-5 bg-dark-4 rounded" />
          <div className="w-6 h-4 bg-dark-4 rounded" />
        </div>
        <div className="w-5 h-5 bg-dark-4 rounded" />
      </div>
    </div>
  )
}

export default PostCardSkeleton

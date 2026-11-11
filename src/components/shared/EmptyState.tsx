type EmptyStateProps = {
  title: string
  description?: string
  icon?: string
}

const EmptyState = ({ title, description, icon = '/assets/icons/posts.svg' }: EmptyStateProps) => {
  return (
    <div className="flex-center flex-col w-full py-10">
      <img
        src={icon}
        alt=""
        width={96}
        height={96}
        className="opacity-30 mb-4"
        aria-hidden="true"
      />
      <h3 className="h3-bold text-light-2 mb-2">{title}</h3>
      {description && (
        <p className="text-light-4 text-center max-w-sm">{description}</p>
      )}
    </div>
  )
}

export default EmptyState

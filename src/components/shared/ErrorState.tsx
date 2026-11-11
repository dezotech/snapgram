type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error. Please try again.',
  onRetry
}: ErrorStateProps) => {
  return (
    <div className="flex-center flex-col w-full py-10">
      <img
        src="/assets/icons/error.svg"
        alt=""
        width={64}
        height={64}
        className="opacity-50 mb-4"
        aria-hidden="true"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <h3 className="h3-bold text-light-2 mb-2">{title}</h3>
      <p className="text-light-4 text-center max-w-sm mb-4">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shad-button_primary px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState

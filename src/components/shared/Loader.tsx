const Loader = () => {
  return (
    <div className="flex-center w-full" role="status" aria-label="Loading">
      <img
        src="/assets/icons/loader.svg"
        alt=""
        width={24}
        height={24}
        className="animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loader

const ProfileSkeleton = () => {
  return (
    <div className="profile-container animate-pulse">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <div className="w-28 h-28 lg:h-36 lg:w-36 rounded-full bg-dark-4" />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full gap-2">
              <div className="h-8 w-48 bg-dark-4 rounded mx-auto xl:mx-0" />
              <div className="h-4 w-32 bg-dark-4 rounded mx-auto xl:mx-0" />
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start">
              <div className="h-6 w-16 bg-dark-4 rounded" />
              <div className="h-6 w-20 bg-dark-4 rounded" />
              <div className="h-6 w-20 bg-dark-4 rounded" />
            </div>
            <div className="mt-7">
              <div className="h-4 w-full max-w-md bg-dark-4 rounded mb-2" />
              <div className="h-4 w-3/4 max-w-md bg-dark-4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

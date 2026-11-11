import { getImageUrl } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const CreatorCard = ({ user }: UserCardProps) => {
  return (
    <Link
      to={`/profile/${user.$id}`}
      className="user-card"
      aria-label={`View ${user.name}'s profile`}
    >
      <img
        src={getImageUrl(user.imageId)}
        alt=""
        className="rounded-full w-14 h-14"
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5"
        onClick={(e) => e.preventDefault()}
        aria-label={`Follow ${user.name}`}
      >
        Follow
      </Button>
    </Link>
  );
};

export default CreatorCard;

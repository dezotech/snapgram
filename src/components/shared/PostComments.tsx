import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useCreateComment, useGetComments } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import Loader from "./Loader";

type PostCommentsProps = {
  postId: string;
  userId: string;
};

const PostComments = ({ postId, userId }: PostCommentsProps) => {
  const { user } = useUserContext();
  const { data: comments, isPending: isCommentsLoading } = useGetComments(postId);
  const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateComment();

  const [commentText, setCommentText] = useState("");

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commentText.trim() === "") return;

    const newComment = await createComment({
      content: commentText,
      postId: postId,
      userId: userId,
    });

    if (newComment) {
      setCommentText("");
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 mt-4 border-t border-dark-4/80 pt-4">
      <h3 className="body-bold text-light-1">Comments</h3>

      {isCommentsLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto custom-scrollbar">
          {comments?.documents.map((comment: Models.Document) => (
            <div key={comment.$id} className="flex gap-3 items-start">
              <Link to={`/profile/${comment.author.$id}`}>
                <img
                  src={comment.author.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>

              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <p className="small-semibold text-light-1">{comment.author.name}</p>
                  <p className="tiny-medium text-light-3">
                    {multiFormatDateString(comment.$createdAt)}
                  </p>
                </div>
                <p className="small-regular text-light-2">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments?.documents.length === 0 && (
            <p className="text-light-3 small-regular">No comments yet.</p>
          )}
        </div>
      )}

      <form onSubmit={handleCreateComment} className="flex gap-3 items-center w-full">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="current user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 bg-dark-3 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0 !important rounded-lg p-2 text-light-1 small-regular"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          type="submit"
          className="shad-button_primary px-4 py-2"
          disabled={isCreatingComment}
        >
          {isCreatingComment ? "Posting..." : "Post"}
        </Button>
      </form>
    </div>
  );
};

export default PostComments;

import Loader from '@/components/shared/Loader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { getImageUrl, multiFormatDateString } from '@/lib/utils'
import { Link, useParams } from 'react-router-dom'

const PostDetails = () => {
  const { user } = useUserContext()
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')

  const handleDeletePost = () => {}

  if (isPending) {
    return (
      <div className="post_details-container">
        <Loader />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post_details-container">
        <p className="text-light-4">Post not found</p>
      </div>
    )
  }

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <img
          src={getImageUrl(post.imageId)}
          alt={post.caption || 'Post image'}
          className="post_details-img"
          loading="lazy"
          decoding="async"
        />

        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`/profile/${post.creator.$id}`}
              className="flex items-center gap-3"
            >
              <img
                src={getImageUrl(post.creator?.imageId)}
                alt={`${post.creator.name}'s profile`}
                className="rounded-full w-9 h-9 lg:w-12 lg:lg:h-12"
                loading="lazy"
                decoding="async"
              />

              <div className="flex flex-col gap-1">
                <p className="base-medium lg:body-bold text-light-1">
                  {post.creator.name}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {multiFormatDateString(post.$createdAt)}
                  </p>
                  {post.location && (
                    <>
                      <span aria-hidden="true">-</span>
                      <p className="subtle-semibold lg:small-regular">
                        {post.location}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4">
              <Link
                to={`/update-post/${post.$id}`}
                className={`${user.id !== post.creator.$id && 'hidden'}`}
                aria-label="Edit post"
              >
                <img
                  src={'/assets/icons/edit.svg'}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </Link>

              <Button
                onClick={handleDeletePost}
                variant="ghost"
                className={`ghost_details-delete_btn ${
                  user.id !== post.creator.$id && 'hidden'
                }`}
                aria-label="Delete post"
              >
                <img
                  src={'/assets/icons/delete.svg'}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
          <hr className="border w-full border-dark-4/80" />

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <PostStats post={post} userId={user.id} />
            {/* TODO: Uncomment this after adding VITE_APPWRITE_COMMENTS_COLLECTION_ID to .env */}
            {/* <PostComments postId={post.$id} userId={user.id} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails

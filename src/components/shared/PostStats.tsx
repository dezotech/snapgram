import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost
} from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'

type PostStatsProps = {
  post?: Models.Document
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes?.map((user: Models.Document) => user?.$id).filter(Boolean) || []

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavePost, isPending: isDeletingPost } =
    useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let newLikes = [...likes]

    const hasLiked = newLikes.includes(userId)

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({ postId: post?.$id || '', likesArray: newLikes })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      deleteSavePost(savedPostRecord.$id)
      setIsSaved(false)
      return
    }

    savePost({ postId: post?.$id || '', userId })
    setIsSaved(true)
  }

  const isLiked = checkIsLiked(likes, userId)

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <button
          type="button"
          onClick={handleLikePost}
          className="cursor-pointer bg-transparent border-none p-0"
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <img
            src={isLiked ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        </button>
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 mr-5">
        {isSavingPost || isDeletingPost ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={handleSavePost}
            className="cursor-pointer bg-transparent border-none p-0"
            aria-label={isSaved ? 'Remove from saved' : 'Save post'}
          >
            <img
              src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default PostStats

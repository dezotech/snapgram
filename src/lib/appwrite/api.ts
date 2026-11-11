import { ID, Permission, Query, Role } from 'appwrite'

import { handleApiError, logError, validateRequired } from '@/lib/utils/errorHandler'
import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './config'

// ============================================================
// AUTH
// ============================================================

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) {
      throw new Error('Failed to create account')
    }

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl
    })

    return newUser
  } catch (error) {
    logError('createUserAccount', error)
    return null
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    return handleApiError('saveUserToDB', error)
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)
    return session
  } catch (error) {
    return handleApiError('signInAccount', error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()
    return currentAccount
  } catch (error) {
    return handleApiError('getAccount', error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()

    if (!currentAccount) {
      throw new Error('No account found')
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error('User not found in database')
    }

    return currentUser.documents[0]
  } catch (error) {
    logError('getCurrentUser', error)
    return null
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    return handleApiError('signOutAccount', error)
  }
}

// ============================================================
// POSTS
// ============================================================

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) {
      throw new Error('Failed to upload file')
    }

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw new Error('Failed to get file preview')
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || []

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw new Error('Failed to create post')
    }

    return newPost
  } catch (error) {
    return handleApiError('createPost', error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
      [Permission.read(Role.any())]
    )

    return uploadedFile
  } catch (error) {
    return handleApiError('uploadFile', error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
    )

    if (!fileUrl) {
      throw new Error('Failed to generate file URL')
    }

    return fileUrl
  } catch (error) {
    return handleApiError('getFilePreview', error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return { status: 'ok' }
  } catch (error) {
    return handleApiError('deleteFile', error)
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) {
      throw new Error('Failed to search posts')
    }

    return posts
  } catch (error) {
    return handleApiError('searchPosts', error)
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string | null }) {
  const queries = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) {
      throw new Error('Failed to fetch posts')
    }

    return posts
  } catch (error) {
    return handleApiError('getInfinitePosts', error)
  }
}

export async function getPostById(postId?: string) {
  if (!postId) {
    throw new Error('Post ID is required')
  }

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  } catch (error) {
    return handleApiError('getPostById', error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) {
        throw new Error('Failed to upload new file')
      }

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw new Error('Failed to get file preview')
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || []

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags
      }
    )

    if (!updatedPost) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      throw new Error('Failed to update post')
    }

    // Delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId)
    }

    return updatedPost
  } catch (error) {
    return handleApiError('updatePost', error)
  }
}

export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) {
    logError('deletePost', 'Post ID and Image ID are required')
    return null
  }

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!statusCode) {
      throw new Error('Failed to delete post')
    }

    await deleteFile(imageId)

    return { status: 'ok' }
  } catch (error) {
    return handleApiError('deletePost', error)
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) {
      throw new Error('Failed to like post')
    }

    return updatedPost
  } catch (error) {
    return handleApiError('likePost', error)
  }
}

export async function savePost(userId: string, postId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )

    if (!savedPost) {
      throw new Error('Failed to save post')
    }

    return savedPost
  } catch (error) {
    return handleApiError('savePost', error)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )

    if (!statusCode) {
      throw new Error('Failed to delete saved post')
    }

    return { status: 'ok' }
  } catch (error) {
    return handleApiError('deleteSavedPost', error)
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) {
    logError('getUserPosts', 'User ID is required')
    return null
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    if (!posts) {
      throw new Error('Failed to fetch user posts')
    }

    return posts
  } catch (error) {
    return handleApiError('getUserPosts', error)
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if (!posts) {
      throw new Error('Failed to fetch recent posts')
    }

    return posts
  } catch (error) {
    return handleApiError('getRecentPosts', error)
  }
}

// ============================================================
// COMMENTS
// ============================================================

export async function createComment(comment: INewComment) {
  if (!appwriteConfig.commentsCollectionId) return null;
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        content: comment.content,
        post: comment.postId,
        author: comment.userId,
      }
    )

    if (!newComment) {
      throw new Error('Failed to create comment')
    }

    return newComment
  } catch (error) {
    return handleApiError('createComment', error)
  }
}

export async function getComments(postId: string) {
  if (!appwriteConfig.commentsCollectionId) return { documents: [], total: 0 };
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal('post', postId), Query.orderDesc('$createdAt')]
    )

    if (!comments) {
      throw new Error('Failed to fetch comments')
    }

    return comments
  } catch (error) {
    return handleApiError('getComments', error)
  }
}

export async function deleteComment(commentId: string) {
  if (!appwriteConfig.commentsCollectionId) return { status: 'fail' };
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    )

    if (!statusCode) {
      throw new Error('Failed to delete comment')
    }

    return { status: 'ok' }
  } catch (error) {
    return handleApiError('deleteComment', error)
  }
}

// ============================================================
// USERS
// ============================================================

export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc('$createdAt')]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    )

    if (!users) {
      throw new Error('Failed to fetch users')
    }

    return users
  } catch (error) {
    return handleApiError('getUsers', error)
  }
}

export async function getUserById(userId: string) {
  try {
    validateRequired({ userId }, 'getUserById')

    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    return handleApiError('getUserById', error)
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0

  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0])
      if (!uploadedFile) {
        throw new Error('Failed to upload profile image')
      }

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw new Error('Failed to get profile image preview')
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId
      }
    )

    if (!updatedUser) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      throw new Error('Failed to update user profile')
    }

    // Delete old profile image after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId)
    }

    return updatedUser
  } catch (error) {
    return handleApiError('updateUser', error)
  }
}

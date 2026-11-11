import { Account, Avatars, Client, Databases, Storage } from 'appwrite'

// Validate required environment variables
const requiredEnvVars = [
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_URL',
  'VITE_APPWRITE_DATABASE_ID',
  'VITE_APPWRITE_STORAGE_ID',
  'VITE_APPWRITE_USER_COLLECTION_ID',
  'VITE_APPWRITE_POST_COLLECTION_ID',
  'VITE_APPWRITE_SAVES_COLLECTION_ID',
] as const

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
)

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missingVars.join('\n')}\n\nPlease check your .env file.`
  )
}

export const appwriteConfig = {
  projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  url: import.meta.env.VITE_APPWRITE_URL as string,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID as string,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID as string,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID as string,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID as string,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID as string,
}

export const client = new Client()
client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.projectID)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)

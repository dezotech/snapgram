# Snapgram

A modern social media application built with React, TypeScript, and Appwrite.

## Features

- **Authentication** - Secure sign up, sign in, and session management
- **Posts** - Create, edit, delete posts with image uploads
- **Social Interactions** - Like and save posts
- **User Profiles** - View and edit profiles with bio and avatar
- **Explore** - Discover posts with infinite scroll and search
- **Responsive Design** - Mobile-first UI with bottom navigation

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI |
| State | TanStack React Query v5, React Context |
| Forms | React Hook Form, Zod validation |
| Backend | Appwrite (Auth, Database, Storage) |
| Routing | React Router v6 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite instance (cloud or self-hosted)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/snapgram.git
cd snapgram
```

1. Install dependencies

```bash
npm install
```

1. Configure environment variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your Appwrite credentials:

```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_STORAGE_ID=your_storage_id
VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
VITE_APPWRITE_POST_COLLECTION_ID=your_post_collection_id
VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
```

1. Start development server

```bash
npm run dev
```

### Appwrite Setup

Create the following collections in your Appwrite database:

#### Users Collection

- `name` (string)
- `username` (string)
- `email` (string)
- `imageUrl` (string)
- `imageId` (string)
- `bio` (string)

#### Posts Collection

- `creator` (relationship to Users)
- `likes` (string array)
- `caption` (string)
- `tags` (string array)
- `imageUrl` (string)
- `imageId` (string)
- `location` (string)

#### Saves Collection

- `user` (relationship to Users)
- `post` (relationship to Posts)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
├── _auth/           # Auth layout and forms
├── _root/           # Main app layout and pages
├── components/
│   ├── forms/       # Form components
│   ├── shared/      # Reusable components
│   └── ui/          # UI primitives (shadcn)
├── context/         # React Context providers
├── lib/
│   ├── appwrite/    # Appwrite client and API
│   ├── react-query/ # Query hooks and mutations
│   ├── utils/       # Helper functions
│   └── validation/  # Zod schemas
└── types/           # TypeScript definitions
```

## License

MIT

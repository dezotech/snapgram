import PostForm from '@/components/forms/PostForm'
import PageHeader from '@/components/shared/PageHeader'

const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <PageHeader icon="/assets/icons/add-post.svg" title="Create Post" />
        <PostForm action="Create" />
      </div>
    </div>
  )
}

export default CreatePost

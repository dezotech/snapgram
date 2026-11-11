import { Navigate, Outlet } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'
import Loader from '@/components/shared/Loader'

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext()

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex-center w-full h-screen">
        <Loader />
      </div>
    )
  }

  // Redirect authenticated users to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      <img
        src="/assets/images/side-img.svg"
        alt="Snapgram promotional image"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
        loading="lazy"
      />
    </>
  )
}

export default AuthLayout

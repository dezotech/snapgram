import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { getImageUrl } from '@/lib/utils'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess, navigate])

  return (
    <header className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center" aria-label="Snapgram home">
          <img
            src="/assets/images/logo.svg"
            alt="Snapgram"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
            aria-label="Log out"
          >
            <img src="/assets/icons/logout.svg" alt="" aria-hidden="true" />
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex gap-3 items-center"
            aria-label={`View ${user.name}'s profile`}
          >
            <img
              src={getImageUrl(user.imageId)}
              alt=""
              className="h-14 w-14 rounded-full"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Topbar

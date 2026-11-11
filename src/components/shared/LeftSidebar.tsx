import { sidebarLinks } from '@/constants'
import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { getImageUrl } from '@/lib/utils'
import { INavLink } from '@/types'
import { useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'

const LeftSidebar = () => {
  const { pathname } = useLocation()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess, navigate])

  return (
    <nav className="leftsidebar" aria-label="Main navigation">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center" aria-label="Snapgram home">
          <img
            src="/assets/images/logo.svg"
            alt="Snapgram"
            width={170}
            height={36}
          />
        </Link>

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
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6" role="list">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <img
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                    src={link.imgURL}
                    alt=""
                    aria-hidden="true"
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
        aria-label="Log out of your account"
      >
        <img src="/assets/icons/logout.svg" alt="" aria-hidden="true" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar

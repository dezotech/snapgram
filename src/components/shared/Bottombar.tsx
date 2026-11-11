import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'react-router-dom';

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-bar" aria-label="Mobile navigation">
      <ul className="flex justify-around w-full" role="list">
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label}>
              <Link
                to={link.route}
                className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}
                aria-current={isActive ? 'page' : undefined}
              >
                <img
                  className={`${isActive && "invert-white"}`}
                  src={link.imgURL}
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                <span className="tiny-medium text-light-2">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Bottombar;

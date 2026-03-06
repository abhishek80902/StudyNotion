import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)

  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res?.data?.data || [])
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b border-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      }`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy"/>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">

            {NavbarLinks.map((link, index) => {

              if (link.title === "Catalog") {
                return (
                  <li key={index}>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />

                      {/* Dropdown */}
                      <div className="invisible absolute left-[50%] top-[50%] z-50 flex w-[250px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-[1.5em] group-hover:opacity-100">

                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks?.length ? (
                          subLinks
                            .filter((subLink) => subLink?.courses?.length)
                            .map((subLink, i) => (
                              <Link
                                key={i}
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-lg py-3 pl-4 hover:bg-richblack-50"
                              >
                                {subLink.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}

                      </div>
                    </div>
                  </li>
                )
              }

              // External Link (Generate Quiz)
              if (link.external) {
                return (
                  <li key={index}>
                    <a
                      href={link.path}
                      target="_self"
                      rel="noopener noreferrer"
                      className="font-semibold text-yellow-50 hover:text-yellow-25"
                    >
                      {link.title}
                    </a>
                  </li>
                )
              }

              // Normal Link
              return (
                <li key={index}>
                  <Link to={link.path}>
                    <p
                      className={
                        matchRoute(link.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }
                    >
                      {link.title}
                    </p>
                  </Link>
                </li>
              )

            })}

          </ul>
        </nav>

        {/* Right Section */}
        <div className="hidden items-center gap-x-4 md:flex">

          {/* Cart */}
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />

              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Login */}
          {token === null && (
            <Link to="/login">
              <button className="rounded border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                Log in
              </button>
            </Link>
          )}

          {/* Signup */}
          {token === null && (
            <Link to="/signup">
              <button className="rounded border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                Sign up
              </button>
            </Link>
          )}

          {/* Profile */}
          {token !== null && <ProfileDropdown />}

        </div>

        {/* Mobile Menu */}
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF"/>
        </button>

      </div>
    </div>
  )
}

export default Navbar

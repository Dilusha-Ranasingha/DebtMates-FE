import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white">
      <ul className="list-none flex gap-4">
        <li>
          <Link to="/" className="text-white no-underline"> Home </Link>
        </li>
        <li>
          <Link to="/about" className="text-white no-underline"> About </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
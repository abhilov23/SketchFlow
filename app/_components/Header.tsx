export default function Header() {
    return (
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <a className="block text-black" href="#">
                <span className="sr-only">Home</span>
                <svg width="160" height="80" xmlns="http://www.w3.org/2000/svg">
                  {/* Flowing Sketch Curve */}
                  <path
                    d="M10 30 Q30 10 50 25 Q70 40 90 25 Q100 20 105 30"
                    stroke="#000000" // Black
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  {/* Small Loop at End */}
                  <path
                    d="M105 30 Q108 28 110 30 Q108 32 105 30"
                    stroke="#000000" // Black
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Text: Sketchflow */}
                  <text
                    x="10"
                    y="50"
                    fontFamily="Caveat, cursive"
                    fontSize="24"
                    fill="#000000" // Black
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    Sketchflow
                  </text>
                </svg>
              </a>
            </div>
  
            {/* Navigation Section */}
            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-8 text-sm font-medium">
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      History
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      Projects
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-600 transition hover:text-gray-900"
                      href="#"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
  
            {/* Buttons Section */}
            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <a
                  className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition"
                  href="#"
                >
                  Login
                </a>
                <div className="hidden sm:flex">
                  <a
                    className="rounded-md bg-gray-200 px-5 py-2 text-sm font-medium text-black hover:bg-gray-300 transition"
                    href="#"
                  >
                    Register
                  </a>
                </div>
              </div>
  
              {/* Mobile Menu Button */}
              <div className="block md:hidden">
                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
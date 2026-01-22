import React from 'react'
import './App.css'

function App() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/' },
    { name: 'Contact', path: '/' },
    { name: 'About', path: '/' },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div style={{ height: '200vh', paddingTop: '100px' }}>
        <h1 className="text-4xl font-bold text-center mb-8">Scroll down to see the effect</h1>
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <p className="mb-4">Scroll to see the navbar change color and style.</p>
        </div>
      </div>

      <nav className={`fixed top-0 left-0 bg-indigo-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
  <a href="" className="flex items-center gap-3">
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 16 16"
      className={`transition-all duration-500 ${isScrolled ? "filter invert opacity-80" : ""}`}
    >
      <path 
        d="M0 0 C2.5 1.5 2.5 1.5 4 4 C4.791013 8.02098277 4.62153384 10.96411027 2.5 14.5 C-1.03588973 16.62153384 -3.97901723 16.791013 -8 16 C-10.5 14.5 -10.5 14.5 -12 12 C-12.791013 7.97901723 -12.62153384 5.03588973 -10.5 1.5 C-6.96411027 -0.62153384 -4.02098277 -0.791013 0 0 Z " 
        fill={isScrolled ? "#333333" : "#F8F9F7"} 
        transform="translate(12,0)"
      />
      <path 
        d="M0 0 C1.32 0 2.64 0 4 0 C4 0.99 4 1.98 4 3 C4.66 3 5.32 3 6 3 C6 4.65 6 6.3 6 8 C5.01 8.495 5.01 8.495 4 9 C4.99 9.33 5.98 9.66 7 10 C7 10.66 7 11.32 7 12 C3.7 12 0.4 12 -3 12 C-3 11.34 -3 10.68 -3 10 C-1.68 10 -0.36 10 1 10 C1 9.34 1 8.68 1 8 C0.01 8 -0.98 8 -2 8 C-1.125 1.125 -1.125 1.125 0 0 Z " 
        fill={isScrolled ? "#666666" : "#9E8D6C"} 
        transform="translate(6,2)"
      />
      <path 
        d="M0 0 C0.66 0 1.32 0 2 0 C2 1.65 2 3.3 2 5 C1.01 5.495 1.01 5.495 0 6 C0.99 6.33 1.98 6.66 3 7 C3 7.66 3 8.32 3 9 C-0.3 9 -3.6 9 -7 9 C-7 8.34 -7 7.68 -7 7 C-5.68 7 -4.36 7 -3 7 C-2.690625 6.21625 -2.38125 5.4325 -2.0625 4.625 C-1 2 -1 2 0 0 Z " 
        fill={isScrolled ? "#999999" : "#BCB79F"} 
        transform="translate(10,5)"
      />
    </svg>
    <span className={`font-bold text-xl ${isScrolled ? "text-gray-800" : "text-white"}`}>
      Logo
    </span>
  </a>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
              {link.name}
              <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
            </a>
          ))}
          <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}>
            New Launch
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <svg className={`h-6 w-6 text-white transition-all duration-500 ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <button className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </a>
          ))}

          <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
            New Launch
          </button>

          <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
            Login
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;

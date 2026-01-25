import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/' },
    { name: 'Contact', path: '/' },
    { name: 'About', path: '/' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoginModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const SimpleButton = ({ children, className = '', ...props }: any) => (
    <button 
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const SimpleInput = ({ type = "text", className = '', ...props }: any) => (
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      type={type}
      {...props}
    />
  );

  const SimpleLabel = ({ children, className = '', ...props }: any) => (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );

  function AnimatedLoginPage({ onClose }: { onClose?: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mouseX, setMouseX] = useState<number>(0);
    const [isTyping, setIsTyping] = useState(false);
    const purpleRef = useRef<HTMLDivElement>(null);
    const blackRef = useRef<HTMLDivElement>(null);
    const yellowRef = useRef<HTMLDivElement>(null);
    const orangeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMouseX(e.clientX);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return { bodySkew: 0 };

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const deltaX = mouseX - centerX;

      const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
      return { bodySkew };
    };

    const purplePos = calculatePosition(purpleRef);
    const blackPos = calculatePosition(blackRef);
    const yellowPos = calculatePosition(yellowRef);
    const orangePos = calculatePosition(orangeRef);

    const getLookDirection = () => {
      if (isTyping) {
        return { x: 3, y: 0 };
      }
      if (showPassword && password.length > 0) {
        return { x: -4, y: -2 };
      }
      return { x: 0, y: 0 };
    };

    const lookDirection = getLookDirection();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 300));
      alert("Login successful! Welcome!");
      
      if (onClose) {
        onClose();
      }
      
      setIsLoading(false);
    };

    return (
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 text-white overflow-hidden">
          <div className="relative flex items-center justify-center h-full">
            <div className="relative" style={{ width: '550px', height: '400px' }}>
              <div 
                ref={purpleRef}
                className="absolute bottom-0 transition-all duration-300 ease-in-out"
                style={{
                  left: '70px',
                  width: '180px',
                  height: '400px',
                  backgroundColor: '#6C3FF5',
                  borderRadius: '10px 10px 0 0',
                  zIndex: 1,
                  transform: `skewX(${purplePos.bodySkew || 0}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <div 
                  className="absolute flex gap-8 transition-all duration-300 ease-in-out"
                  style={{
                    left: '45px',
                    top: '40px',
                  }}
                >
                  <div className="size-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div 
                      className="size-2 bg-black rounded-full"
                      style={{
                        transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    />
                  </div>
                  <div className="size-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div 
                      className="size-2 bg-black rounded-full"
                      style={{
                        transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div 
                ref={blackRef}
                className="absolute bottom-0 transition-all duration-300 ease-in-out"
                style={{
                  left: '240px',
                  width: '120px',
                  height: '310px',
                  backgroundColor: '#2D2D2D',
                  borderRadius: '8px 8px 0 0',
                  zIndex: 2,
                  transform: `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <div 
                  className="absolute flex gap-6 transition-all duration-300 ease-in-out"
                  style={{
                    left: '26px',
                    top: '32px',
                  }}
                >
                  <div className="size-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div className="size-2 bg-black rounded-full" />
                  </div>
                  <div className="size-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div className="size-2 bg-black rounded-full" />
                  </div>
                </div>
              </div>
              <div 
                ref={orangeRef}
                className="absolute bottom-0 transition-all duration-300 ease-in-out"
                style={{
                  left: '0px',
                  width: '240px',
                  height: '200px',
                  zIndex: 3,
                  backgroundColor: '#FF9B6B',
                  borderRadius: '120px 120px 0 0',
                  transform: `skewX(${orangePos.bodySkew || 0}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <div 
                  className="absolute flex gap-8 transition-all duration-300 ease-in-out"
                  style={{
                    left: '82px',
                    top: '90px',
                  }}
                >
                  <div className="size-3 bg-black rounded-full" />
                  <div className="size-3 bg-black rounded-full" />
                </div>
              </div>
              <div 
                ref={yellowRef}
                className="absolute bottom-0 transition-all duration-300 ease-in-out"
                style={{
                  left: '310px',
                  width: '140px',
                  height: '230px',
                  backgroundColor: '#E8D754',
                  borderRadius: '70px 70px 0 0',
                  zIndex: 4,
                  transform: `skewX(${yellowPos.bodySkew || 0}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <div 
                  className="absolute flex gap-6 transition-all duration-300 ease-in-out"
                  style={{
                    left: '52px',
                    top: '40px',
                  }}
                >
                  <div className="size-3 bg-black rounded-full" />
                  <div className="size-3 bg-black rounded-full" />
                </div>
                <div 
                  className="absolute w-20 h-1 bg-black rounded-full"
                  style={{
                    left: '40px',
                    top: '88px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-8">
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <SimpleLabel htmlFor="email">Email</SimpleLabel>
                <SimpleInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                />
              </div>
              <div>
                <SimpleLabel htmlFor="password">Password</SimpleLabel>
                <div className="relative">
                  <SimpleInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Optional"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 1000);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 015 12c0 1.933.458 3.76 1.267 5.39m7.476-7.476a3 3 0 00-4.243-4.243M12 12l-9 9" />
                      </svg>
                    ) : (
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <SimpleButton type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </SimpleButton>
            </form>
          </div>
        </div>
      </div>
    );
  }
  function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center p-0">
          <div className="relative w-full h-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full p-2 bg-black/10 hover:bg-black/20 transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AnimatedLoginPage onClose={onClose} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ height: '200vh', paddingTop: '100px' }}>
        <h1 className="text-4xl font-bold text-center mb-8">Scroll down to see the effect</h1>
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <p className="mb-4">Scroll to see the navbar change color and style.</p>
          <p className="mb-4">Click the Login button to see animated characters!</p>
        </div>
      </div>
      <nav className={`fixed top-0 left-0 bg-indigo-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
        <a href="" className="flex items-center gap-3">
          <img 
            src="./img/retech_logo.ico"
            alt="ReTech"
            width="50"
            height="50"
            className={`transition-all duration-500 ${isScrolled ? "filter invert opacity-80" : ""}`}
          />
          <span className={`font-bold text-xl ${isScrolled ? "text-gray-800" : "text-white"}`}>
            ReTech
          </span>
        </a>
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
              {link.name}
              <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black hover:bg-gray-800" : "bg-white text-black hover:bg-gray-100"}`}
          >
            Login
          </button>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <svg 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
        <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button 
            className="absolute top-4 right-4" 
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {navLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-500"
          >
            Login
          </button>
        </div>
      </nav>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}

export default App;

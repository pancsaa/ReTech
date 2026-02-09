// src/components/AboutUs.tsx
import { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative bg-white overflow-hidden">
      <div className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto text-center z-10">
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 transition-all duration-1000 underline underline-offset-[12px] decoration-green-400/60 decoration-2 hover:decoration-green-500 hover:decoration-4 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          ReTech
        </h1>
        <p
  className={`mt-10 text-xl md:text-2xl lg:text-3xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
  }`}
>
  <span className="underline underline-offset-4 decoration-gray-300 decoration-1 hover:decoration-gray-500">
    Második
  </span>
  {' '} esély az elektronikának

  <span className="block h-8 sm:h-10 lg:h-5" aria-hidden="true"></span>
  Online piactér elektronikai eszközök eladására, cseréjére és adományozására.
</p>

        <p
          className={` mt-12 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Környezetbarát és emberközpontú rendszert építünk,
          ahol az elektronikai cikkek ne a szeméttelepen, hanem új gazdánál kapjanak második esélyt.
        </p>
      </div>  
    </div>
  );
};

export default AboutUs;
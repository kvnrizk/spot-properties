"use client";

import { useEffect, useState } from "react";

interface MobileHeaderProps {
  children: React.ReactNode;
}

export function MobileHeader({ children }: MobileHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply hide/show logic on mobile (<1024px)
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
        return;
      }

      // Show header when scrolling up, hide when scrolling down
      // But always show when at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        border-b border-spot-dark/10 bg-spot-beige
        transition-transform duration-200 ease-in-out
        shadow-sm
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {children}
    </header>
  );
}

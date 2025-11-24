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

    // Add scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        border-b border-spot-dark/10 bg-white/50 backdrop-blur-sm
        sticky top-0 z-50
        transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {children}
    </header>
  );
}

"use client";

import { useEffect } from "react";

interface HtmlAttributesUpdaterProps {
  lang?: string;
  dir?: string;
  htmlClassName?: string;
  bodyClassName?: string;
}

export function HtmlAttributesUpdater({
  lang,
  dir,
  htmlClassName,
  bodyClassName,
}: HtmlAttributesUpdaterProps) {
  useEffect(() => {
    // Update HTML attributes
    if (lang) {
      document.documentElement.lang = lang;
    }
    if (dir) {
      document.documentElement.dir = dir;
    }
    if (htmlClassName) {
      // Preserve existing classes and add new ones
      const existingClasses = document.documentElement.className.split(" ");
      const newClasses = htmlClassName.split(" ");
      const combinedClasses = Array.from(
        new Set([...existingClasses, ...newClasses])
      );
      document.documentElement.className = combinedClasses.join(" ");
    }
    if (bodyClassName && document.body) {
      // Preserve existing classes and add new ones
      const existingClasses = document.body.className.split(" ");
      const newClasses = bodyClassName.split(" ");
      const combinedClasses = Array.from(
        new Set([...existingClasses, ...newClasses])
      );
      document.body.className = combinedClasses.join(" ");
    }
  }, [lang, dir, htmlClassName, bodyClassName]);

  return null;
}

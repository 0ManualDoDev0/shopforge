"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(80), 50);
    const t2 = setTimeout(() => {
      setWidth(100);
      const t3 = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 250);
      return () => clearTimeout(t3);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-0.5 bg-violet-500 transition-[width] duration-300 ease-out pointer-events-none"
      style={{ width: `${width}%` }}
    />
  );
}

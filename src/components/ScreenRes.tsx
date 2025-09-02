'use client';
import { useEffect, useState } from 'react';

export default function ScreenRes() {
  const [size, setSize] = useState<string>("");

  useEffect(() => {
    // function to set size
    const updateSize = () => {
      setSize(`${window.innerWidth} x ${window.innerHeight}`);
    };

    // set immediately
    updateSize();

    // listen for resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size; // returns string directly
}

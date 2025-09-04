'use client';
import { useEffect, useState } from 'react';

type TypeinProps = { className?: string };

export default function Typein({ className }: TypeinProps) {
  const [name, setName] = useState<string>("...");

  useEffect(() => {
    fetch("/mydata.json", { cache: "no-store" })
      .then(res => res.json())
      .then(d => setName(d.name));
  }, []);

  const text = `Welcome, ${name}`;

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen entry select-none fixed z-50">
      <h1 className={`bubble-text text-8xl text-center ${className ?? ""}`}>
        <span className="typing" style={{ ["--n" as any]: text.length }}>
          {text}
        </span>
      </h1>
    </div>
  );
}

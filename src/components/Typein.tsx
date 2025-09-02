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
    <h1 className={`bubble-text ${className ?? ""}`}>
      <span className="typing" style={{ ["--n" as any]: text.length }}>
        {text}
      </span>
    </h1>
  );
}

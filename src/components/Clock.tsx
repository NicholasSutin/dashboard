"use client";
import { useEffect, useState } from "react";

export default function Clock() {
  const format = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [time, setTime] = useState(format);

  useEffect(() => {
    setTime(format()); // set right away

    const id = setInterval(() => {
      setTime(format());
    }, 60_000); // update every minute

    return () => clearInterval(id);
  }, []);

  return <span className="bubble-text text-6xl ml-2">{time}</span>;
}
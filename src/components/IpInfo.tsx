'use client';
import { useEffect, useState } from 'react';

export default function IpInfo() {
  const [text, setText] = useState('loading...');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ipdata')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setText(`data center: ${d.fl} | ip: ${d.ip}`);
      })
      .catch(() => !cancelled && setText('data center: ? | ip: ?'));

    return () => {
      cancelled = true;
    };
  }, []);

  return text; // plain string
}

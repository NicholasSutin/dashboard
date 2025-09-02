'use client';
import { useEffect, useState } from 'react';

type Item = { symbol: string; text?: string; percent?: number; error?: string };

export default function MarketList() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshMs, setRefreshMs] = useState<number>(10_000); // default 10s

  useEffect(() => {
    let cancelled = false;

    // fetch refresh interval from mydata.json
    fetch('/mydata.json')
      .then(r => r.json())
      .then(cfg => {
        if (!cancelled && typeof cfg.TickersRefresh === 'number') {
          setRefreshMs(cfg.TickersRefresh);
        }
      })
      .catch(() => {}); // ignore errors, keep default

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = () =>
      fetch('/api/marketdata')
        .then(r => r.json())
        .then(d => { if (!cancelled) setItems(d.items ?? []); })
        .catch(() => { if (!cancelled) setItems([]); });

    load(); // initial fetch

    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, refreshMs);

    const onVis = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [refreshMs]);

  if (!items.length) return <>…</>;

  return (
    <span>
      {items.map((x, i) => {
        let pct: number | null =
          typeof x.percent === 'number'
            ? x.percent
            : (x.text?.match(/^[+\-]\d+(\.\d+)?/) ? parseFloat(x.text) : null);

        const cls =
          pct == null ? 'custom-gray' :
          pct > 0    ? 'custom-green' :
          pct < 0    ? 'custom-red'   : 'custom-gray';

        return (
          <span key={x.symbol}>
            {x.symbol}: <span className={cls}>{x.text ?? '?'}</span>
            {i < items.length - 1 ? ', ' : ''}
          </span>
        );
      })}
    </span>
  );
}

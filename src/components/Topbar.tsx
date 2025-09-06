"use client";

type TopbarProps = {
  children: React.ReactNode;
};

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className="w-full bg-[var(--background)] p-[10px] flex flex-row">
      {children}
    </div>
  );
}

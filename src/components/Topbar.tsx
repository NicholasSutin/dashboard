"use client";

type TopbarProps = {
  children: React.ReactNode;
};

export default function Topbar({ children }: TopbarProps) {
  return (
    <div className="fixed top-0 left-0 w-screen bg-[var(--background)] p-[10px] z-10 flex flex-row">
      {children}
    </div>
  );
}
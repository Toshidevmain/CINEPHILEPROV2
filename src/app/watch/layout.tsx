export default function WatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {children}
    </div>
  );
}

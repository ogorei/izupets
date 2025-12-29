

interface LayoutProps {
  children: React.ReactNode;
}

export default function ConciergeLayout({ children}: LayoutProps) {
  return (
    <div className="w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 mx-auto">
      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  );
}
interface LayoutProps {
  children: React.ReactNode;
}

export default function ConciergeLayout({ children}: LayoutProps) {
  return (
    <div className="w-full md:max-w-7xl p-5 md:p-10 mx-auto">
      {/* Main Content */}
      <main className="lg:col-span-2">{children}</main>
    </div>
  );
}
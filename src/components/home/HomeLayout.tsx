interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode; // Sidebar is optional
}

export default function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="w-full md:max-w-7xl p-5 md:p-10 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-16 md:pt-20">
      {/* Main Content */}
      <main className="lg:col-span-2">{children}</main>

      {/* Sidebar (if provided) */}
      {sidebar && (
        <aside className="flex flex-col w-full lg:w-auto h-auto self-start">
          {sidebar}
        </aside>
      )}
    </div>
  );
}

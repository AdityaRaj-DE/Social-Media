export default function MobileShell({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="mx-auto min-h-screen max-w-[420px] bg-white dark:bg-black">
        {children}
      </div>
    );
  }
  
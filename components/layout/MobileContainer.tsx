export default function MobileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-white">
      {children}
    </div>
  );
}
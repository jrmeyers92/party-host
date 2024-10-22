export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto my-20 flex max-w-7xl flex-col items-center gap-12">
      {children}
    </div>
  );
}

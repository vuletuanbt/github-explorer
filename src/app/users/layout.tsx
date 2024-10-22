import Search from "@/components/search";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-10 text-center h-screen w-screen flex items-center flex-col">
      <section className="flex flex-col items-center">
        <Search />
      </section>
      <section className="flex flex-col items-center w-full">
        {children}
      </section>
    </div>
  );
}

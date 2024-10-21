import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SearchBar from "@/components/search";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-10 text-center h-screen w-screen flex items-center flex-col">
      {/* Search Section */}
      <SearchBar />
      {/* End Search Section */}
      {children}
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </div>
  );
}

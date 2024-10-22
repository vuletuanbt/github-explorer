import Search from "@/components/search";
import UserSearch from "@/features/user/components/UserSearch";

export default async function Home({
  searchParams: { keyword },
}: {
  searchParams: { keyword?: string };
}) {
  return (
    <div className="px-10 text-center h-screen w-screen flex items-center flex-col">
      <section className="flex flex-col items-center">
        <Search keyword={keyword} />
      </section>
      <section className="flex flex-col items-center">
        {keyword && <UserSearch key={keyword} keyword={keyword} />}
      </section>
    </div>
  );
}

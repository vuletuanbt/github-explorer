import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type SearchProps = {
  keyword?: string;
};

const Search = async ({ keyword }: SearchProps) => {
  return (
    <section className="search-avatar-section w-full flex-1 mt-10">
      <div className="flex flex-col items-center">
        <form className="flex items-center mb-10" action={"/"}>
          <Input
            placeholder="Search User..."
            className="mr-1 text-lg w-200"
            name="keyword"
            defaultValue={keyword}
          />
          <Button type="submit">Search</Button>
        </form>
      </div>
    </section>
  );
};

export default Search;

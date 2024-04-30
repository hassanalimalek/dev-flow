"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { useRouter } from "next/navigation";

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const [active, setActive] = useState(filter);

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null, // reset
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none
        ${
          active === item.value
            ? "bg-primary-100"
            : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
        }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;

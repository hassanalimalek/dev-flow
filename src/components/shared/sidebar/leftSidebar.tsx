"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";

function LeftSidebar() {

  const { user } = useUser();

  const userId = user?.id;
  const pathname = usePathname();

  return (
    <div className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen w-fit flex-col justify-between  overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <section className="flex h-full flex-col gap-6">
        {sidebarLinks?.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          if (item.route === "/profile") {
            if (userId) {
              item.route = `/profile/${userId}`;
            } else {
              return null;
            }
          }
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </section>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button
              className="small-medium btn-secondary
                    min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Image
                src="assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button
              className="small-medium light-border-2 btn-tertiary text-dark400_light900
                    min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Image
                src="assets/icons/sign-up.svg"
                alt="signup"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}

export default LeftSidebar;

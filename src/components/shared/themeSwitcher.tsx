"use client";
import { useTheme } from "@/context/themeContext";
import Image from "next/image";
import React from "react";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      {theme === "dark" ? (
        <Image
          className="cursor-pointer"
          alt="sun"
          src="/assets/icons/sun.svg"
          width={20}
          height={20}
          onClick={toggleTheme}
        />
      ) : (
        <Image
          className="cursor-pointer"
          alt="moon"
          src="/assets/icons/moon.svg"
          width={20}
          height={20}
          onClick={toggleTheme}
        />
      )}
    </div>
  );
}

export default ThemeSwitcher;

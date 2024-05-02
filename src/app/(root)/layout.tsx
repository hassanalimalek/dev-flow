import Navbar from "@/components/shared/navbar/navbar";
import LeftSidebar from "@/components/shared/sidebar/leftSidebar";
import RightSidebar from "@/components/shared/sidebar/rightSidebar";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section
          className="
        flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <Toaster />

        <RightSidebar />
      </div>
    </main>
  );
};

export default Layout;

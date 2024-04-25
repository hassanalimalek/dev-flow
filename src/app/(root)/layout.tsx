import Navbar from "@/components/shared/navbar/navbar";
import LeftSidebar from "@/components/shared/sidebar/leftSidebar";
import RightSidebar from "@/components/shared/sidebar/rightSidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section
          className="
        flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;

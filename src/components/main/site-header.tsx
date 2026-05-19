import { siteConfig } from "@/configs/site";
import React from "react";
import MainNav from "@/components/navigation/main-nav";

const SiteHeader = () => {
  return (
    <header className="relative z-50">
      <MainNav items={siteConfig.mainNav} />
    </header>
  );
};

export default SiteHeader;

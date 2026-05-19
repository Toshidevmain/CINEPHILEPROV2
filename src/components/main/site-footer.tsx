import React from "react";
import { siteConfig } from "@/configs/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="w-full bg-[#141414] pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-[4%]">
        <div className="flex items-center gap-4 mb-8">
          {siteConfig.socialLinks.map(
            (item, i) =>
              item.href && (
                <Link key={i} href={item.href} target="_blank" rel="noreferrer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:text-white transition-colors">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="sr-only">{item.title}</span>
                  </div>
                </Link>
              ),
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { title: 'Audio Description', href: '/' },
            { title: 'Help Center', href: '/' },
            { title: 'Gift Cards', href: '/' },
            { title: 'Media Center', href: '/' },
            { title: 'Investor Relations', href: '/' },
            { title: 'Jobs', href: '/' },
            { title: 'Terms of Use', href: '/terms-of-use' },
            { title: 'Privacy', href: '/' },
            { title: 'Legal Notices', href: '/' },
            { title: 'Cookie Preferences', href: '/' },
            { title: 'Corporate Information', href: '/' },
            { title: 'Contact Us', href: '/' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-sm text-[#777] hover:text-white transition-colors">
              {item.title}
            </Link>
          ))}
        </div>
        <p className="mt-8 text-xs text-[#555]">
          Developed by Marjhun Baylon | All Rights Reserved | {new Date().getFullYear()} {siteConfig.author}
        </p>
        <p className="mt-2 text-xs text-[#555] leading-relaxed">
          CinePhile does not host any files, it only links to 3rd party services. Legal issues should be taken up with the file hosts and providers. CinePhile is not responsible for any media files shown by the video providers.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;

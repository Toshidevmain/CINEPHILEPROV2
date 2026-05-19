import React from "react";
import { siteConfig } from "@/configs/site";
import Link from "next/link";
import { Icons } from "@/components/icons";

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="w-full bg-[#141414] pt-12 pb-8 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-[4%]">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-xl font-bold text-netflix mr-4">
            CINEPHILE
          </Link>
          {siteConfig.socialLinks.map(
            (item, i) =>
              item.href && (
                <Link key={i} href={item.href} target="_blank" rel="noreferrer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:text-netflix transition-all duration-200 hover:scale-110">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="sr-only">{item.title}</span>
                  </div>
                </Link>
              ),
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { title: 'Audio Description', href: '#' },
            { title: 'Help Center', href: '#' },
            { title: 'Gift Cards', href: '#' },
            { title: 'Media Center', href: '#' },
            { title: 'Investor Relations', href: '#' },
            { title: 'Jobs', href: '#' },
            { title: 'Terms of Use', href: '#' },
            { title: 'Privacy', href: '#' },
            { title: 'Legal Notices', href: '#' },
            { title: 'Cookie Preferences', href: '#' },
            { title: 'Corporate Information', href: '#' },
            { title: 'Contact Us', href: '#' },
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
          Developed by{' '}
          <Link
            href={siteConfig.links.marjhunf}
            target="_blank"
            rel="noreferrer"
            className="text-netflix hover:underline">
            {siteConfig.author}
          </Link>{' '}
          | All Rights Reserved | {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p className="mt-2 text-xs text-[#555] leading-relaxed">
          CinePhile does not host any files, it only links to 3rd party services. Legal issues should be taken up with the file hosts and providers. CinePhile is not responsible for any media files shown by the video providers.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;

"use client";

import * as React from "react";
import Link from "next/link";

export type LiquidNavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export function LiquidNavbar({
  items,
  activeHref,
  className = "",
}: {
  items: LiquidNavItem[];
  activeHref: string;
  className?: string;
}) {
  const activeIndex = items.findIndex((item) =>
    item.href === "/" ? activeHref === "/" : activeHref.startsWith(item.href)
  );

  return (
    <nav className={`liquid-navbar ${className}`} aria-label="Asosiy menyu">
      <style jsx global>{`
        .liquid-navbar {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.95),
            inset 0 0 0 1px rgba(53, 99, 233, 0.04),
            0 10px 30px -18px rgba(53, 99, 233, 0.42);
          backdrop-filter: blur(14px) saturate(1.18);
          isolation: isolate;
        }
        .liquid-navbar::before {
          content: "";
          position: absolute;
          inset: 5px auto 5px 6px;
          width: 0;
          height: 42px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 28% 10%, rgba(255, 255, 255, 0.95), transparent 30%),
            linear-gradient(135deg, rgba(53, 99, 233, 0.12), rgba(53, 99, 233, 0.05));
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 5px 14px -8px rgba(53, 99, 233, 0.55);
          opacity: 0;
          pointer-events: none;
        }
        .liquid-item {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 42px;
          padding: 0 13px;
          border-radius: 999px;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: color 180ms ease, transform 180ms ease, background 180ms ease;
        }
        .liquid-item:hover {
          color: #3563e9;
          background: rgba(53, 99, 233, 0.055);
        }
        .liquid-item[aria-current="page"] {
          color: #3563e9;
          background: rgba(53, 99, 233, 0.09);
        }
        .liquid-item:focus-visible {
          outline: 2px solid #3563e9;
          outline-offset: 2px;
        }
        .liquid-item:active {
          transform: scale(0.96);
        }
        .liquid-icon {
          display: none;
          width: 17px;
          height: 17px;
        }
        @media (min-width: 1280px) {
          .liquid-item { padding-inline: 14px; }
        }
      `}</style>
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className="liquid-item"
          aria-current={index === activeIndex ? "page" : undefined}
        >
          {item.icon && <span className="liquid-icon">{item.icon}</span>}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Box,
  Building2,
  Shield,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Box,
  },
  {
    title: "Company",
    href: "/dashboard/company",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Shield,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] bg-[#002b1f] text-white flex flex-col justify-between">
      
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl font-bold">InvoiceFlow</h1>
          <p className="text-sm text-yellow-400">PRO</p>
        </div>

        {/* Button */}
        <div className="p-4">
          <button className="w-full bg-yellow-500 text-black py-3 rounded-xl font-medium hover:bg-yellow-400 transition">
            + New Invoice
          </button>
        </div>

        {/* Menu */}
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#0c4b35]"
                    : "hover:bg-white/10"
                }`}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="text-red-300 hover:text-red-200">
          Sign out
        </button>
      </div>
    </aside>
  );
}
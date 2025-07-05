"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  Share2Icon,
  ImageIcon,
  Image,
} from "lucide-react";

const sidebarItems = [
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/bg-remove", icon: Image, label: "Background Remove" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open text-white bg-gradient-to-br from-[#1e1b32] to-[#0c1023] min-h-screen">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="w-full bg-black/30 backdrop-blur-md shadow-lg z-10">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="text-2xl font-bold tracking-tight cursor-pointer bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                  ImageCut
                </div>
              </Link>
            </div>
            {!isSignedIn && (
              <div className="flex gap-4">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </div>
            )}
            <div className="flex-none flex items-center space-x-4">
              {user && (
                <>
                  <div className="avatar md:hidden">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username || user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>
                  <span className="hidden md:block text-sm truncate max-w-xs">
                    {user.fullName}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle"
                  >
                    <LogOutIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-black/40 backdrop-blur-md w-64 h-full flex flex-col shadow-xl border-r border-white/10">
          <div className="flex items-center justify-center py-6">
            <ImageIcon className="w-10 h-10 text-purple-400" />
          </div>
          <ul className="menu p-4 w-full text-white flex-grow space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-purple-600 text-white shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-full"
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

"use client";
import { Image, LogOutIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { SignInButton, useClerk, SignUpButton, useUser } from "@clerk/nextjs";

const cta = [
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/bg-remove", icon: Image, label: "Background Remove" },
];

function Page({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleLogoClick = () => router.push("/");

  const handleLogOut = async () => await signOut();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b32] to-[#0c1023] text-white px-6 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full mt-6 rounded-full bg-black/30 backdrop-blur-md">
        <div className="navbar max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="text-2xl font-bold tracking-tight cursor-pointer"
          >
            ImageCut
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isSignedIn && (
              <>
                <button className="border border-purple-400 px-4 py-1 rounded-full hover:bg-purple-600 transition hidden md:block">
                  <SignInButton mode="modal" />
                </button>
                <button className="border border-purple-400 px-4 py-1 rounded-full hover:bg-purple-600 transition">
                  <SignUpButton mode="modal" />
                </button>
              </>
            )}
            {user && (
              <>
                <div className="avatar w-8 h-8 rounded-full overflow-hidden md:hidden">
                  <img
                    src={user.imageUrl}
                    alt={user.username || user.emailAddresses[0].emailAddress}
                  />
                </div>
                <span className="hidden md:block text-sm truncate max-w-xs ">
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogOut}
                  className="btn btn-ghost btn-circle"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Transform Images in Seconds
        </h1>
        <p className="max-w-2xl text-gray-300 text-lg italic">
          Remove backgrounds, change aspect ratios, and enhance your images with{" "}
          <span className="text-purple-300">AI tools made for creators.</span>
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {cta.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="px-6 py-3 rounded-full bg-white text-black font-semibold shadow-md hover:shadow-[0px_0px_10px_6px_#b794f4] transition transform hover:scale-110">
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      </main>
      <footer className="w-full text-center py-4 mt-12 border-t border-white/10 text-sm text-white/60 hover:text-white transition">
        Created with ❤️ by{" "}
        <span className="text-white font-semibold">Tejas Wadpillewar</span>
      </footer>
    </div>
  );
}

export default Page;

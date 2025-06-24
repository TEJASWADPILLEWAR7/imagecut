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

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleLogOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-base-100 text-amber-50 px-6 flex flex-col">
      <header className="w-full bg-base-200 mt-5 rounded-4xl">
        <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex-none lg:hidden"></div>
          <div className="flex-1">
            <Link href="/" onClick={handleLogoClick}>
              <div className="btn btn-ghost normal-case text-xl font-bold tracking-tight cursor-pointer md:text-2xl">
                ImageCut
              </div>
            </Link>
          </div>
          {!isSignedIn && (
            <div className="flex gap-4 cursor-pointer ">
              <button className="btn btn-outline btn-primary hidden md:block">
                <SignInButton mode="modal" />
              </button>
              <button className="btn btn-outline btn-primary ">
                <SignUpButton mode="modal" />
              </button>
            </div>
          )}
          <div className="flex-none flex items-center space-x-4">
            {user && (
              <>
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={user.imageUrl}
                      alt={user.username || user.emailAddresses[0].emailAddress}
                    />
                  </div>
                </div>
                <span className="text-sm truncate max-w-xs lg:max-w-md">
                  {user.username || user.emailAddresses[0].emailAddress}
                </span>
                <button
                  onClick={handleLogOut}
                  className="btn btn-ghost btn-circle"
                >
                  <LogOutIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-6 bg-base-100 ">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
          Transform Images in Seconds — No Photoshop Needed!
        </h1>
        <p className="max-w-xl hidden md:block">
          Remove backgrounds, change aspect ratios, and enhance your images with{" "}
          <em>AI tools made for creators.</em>
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {cta.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="px-6 py-3 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all">
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;

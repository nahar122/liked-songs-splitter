import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const user = useUser();
  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-purple-900  bg-black py-4 text-center align-middle font-semibold shadow-lg shadow-purple-900">
        <div>
          <Link href={"/"}>
            <div className=" mx-4 rounded-lg  p-4 font-bold text-white transition-colors hover:text-yellow-400">
              VibeSplit
            </div>
          </Link>
        </div>
        <div className="flex cursor-pointer items-center justify-between align-middle">
          <div>
            <span className="p-4 transition hover:text-yellow-400">Split</span>
          </div>
          <div>
            <Link href={`playlist-dashboard`}>
              <span className="p-4 transition hover:text-yellow-400">
                My Playlists
              </span>
            </Link>
          </div>
          {!user.isSignedIn && (
            <>
              <SignInButton>
                <button className="mx-2 break-words rounded-full bg-white px-8 py-2 font-semibold text-black transition-transform hover:-translate-x-1">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="mx-2 break-words rounded-full bg-white px-8 py-2 font-semibold text-black transition-transform hover:-translate-x-1">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
          {!!user.isSignedIn && (
            <div className="mx-2 rounded-full bg-white px-8 py-2 font-semibold text-black transition-transform hover:translate-x-1">
              <SignOutButton />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

import Link from "next/link";
import Nav from "./Nav";
import ConnectWalletButton from "../ConnectWalletButton";
import LogoImage from "@/img/logo-transparent.png";
import Image from "next/image";

export default function Header() {
  return (
    <header className="h-header sticky top-0 z-[20] flex w-full items-center justify-center bg-background-primary backdrop-blur-xl">
      <div className="flex w-full max-w-screen-xl flex-col gap-2 p-4 pb-2 md:pb-4">
        <div className="flex w-full items-center justify-between mt-5">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="group flex items-center gap-1">
              <Image src={LogoImage.src} alt="Sigma Finance" className="size-24 mt-5" />
            </Link>
          </div>
          <div className="hidden md:block">
            <Nav />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ConnectWalletButton />
          </div>
        </div>
        <div className="md:hidden">
          <Nav />
        </div>
      </div>
    </header>
  );
}

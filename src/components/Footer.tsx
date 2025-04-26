import { ModeToggle } from "./ModeToggle";
import LinkExternal from "./LinkExternal";

export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center justify-self-end text-content-secondary label-sm">
      <div className="mx-6 flex h-full w-full max-w-screen-xl flex-col gap-5 border-t pb-20 pt-6 lg:pb-4 lg:pt-4">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-6">
            
            <LinkExternal
              href="https://paperclip.xyz"
              className="hover:underline hover:brightness-100"
              keepReferrer
              hideArrow
            >
              Originally Developed by Paperclip Labs
            </LinkExternal>
            <LinkExternal
              href="https://github.com/VaultSigma"
              className="hover:underline hover:brightness-100"
              keepReferrer
              hideArrow
            >
              Github
            </LinkExternal>
            <LinkExternal
              href="https://docs.morpho.org"
              className="hover:underline hover:brightness-100"
              keepReferrer
              hideArrow
            >
              Docs
            </LinkExternal>
          </div>
          <ModeToggle />
        </div>
        <div className="flex max-w-[680px] flex-col gap-4 text-content-ternary paragraph-sm">
          <span>
            This template was specifically forked for the Swell City Buildathon.
          </span>
          <div>
            Always verify URLs before connecting your wallet.
          </div>
        </div>
      </div>
    </footer>
  );
}

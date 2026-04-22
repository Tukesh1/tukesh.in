import { FaGithub } from "react-icons/fa";
import { signInWithGitHubAction, signOutAction } from "@/app/guestbook/actions";

export function SignInWithGitHub({ className }: { className?: string }) {
  return (
    <form action={signInWithGitHubAction}>
      <button
        type="submit"
        className={
          className ??
          "inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        }
      >
        <FaGithub className="size-4" />
        Sign in with GitHub
      </button>
    </form>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={
          className ??
          "font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        }
      >
        Sign out
      </button>
    </form>
  );
}

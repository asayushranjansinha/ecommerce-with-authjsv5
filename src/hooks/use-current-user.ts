import { useSession } from "@/components/providers/session-provider";
import { Session } from "next-auth";

/**
 * Custom hook to get the current user from the session.
 * 
 * This hook utilizes the `useSession` hook from `next-auth/react` to fetch
 * the session data and returns the user object if it exists.
 * 
 * @returns {Session['user']|undefined} The user object if the session exists, otherwise undefined.
 */
export const useCurrentUser = (): Session['user'] | undefined => {
    const { session } = useSession();
    return session?.user;
};


/**
 * Custom hook to get the current user's role from the session.
 * 
 * This hook utilizes the `useSession` hook from `next-auth/react` to fetch
 * the session data and returns the user's role if it exists.
 * 
 * @returns {Session['user']["role"]|undefined} The user's role if the session exists, otherwise undefined.
 */
export const useCurrentUserRole = (): Session['user']["role"] | undefined => {
    const { session } = useSession();
    return session?.user?.role;
};
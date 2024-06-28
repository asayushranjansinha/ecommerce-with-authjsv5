import { auth } from '@/auth';
import { Session } from 'next-auth';

/**
 * Fetches the current user's session and returns the user object.
 * 
 * This function utilizes an `auth` function to fetch the session data asynchronously
 * and returns the user object if it exists.
 * 
 * @returns {Promise<Session['user'] | undefined>} A promise that resolves to the user 
 * object if the session exists, otherwise undefined.
 */
export const useCurrentUser = async (): Promise<Session['user'] | undefined> => {
    const session = await auth();
    console.log("util function: ", {session})
    return session?.user;
}

/**
 * Fetches the current user's session and returns the user's role.
 * 
 * This function utilizes an `auth` function to fetch the session data asynchronously
 * and returns the user's role if it exists.
 * 
 * @returns {Promise<string|undefined>} A promise that resolves to the user's role
 * if the session exists, otherwise undefined.
 */
export const useCurrentUserRole = async (): Promise<Session['user']["role"] | undefined> => {
    const session = await auth();
    return session?.user.role;
}

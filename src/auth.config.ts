import bcrypt from 'bcryptjs';
import { LoginSchema } from './schemas';
import { getUserByEmail } from './data/user';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

export default {
    providers: [
        Google({
            clientId:process.env.GOOGLE_CLIEND_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        Github({
            clientId:process.env.GITHUB_CLIEND_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordMatches = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordMatches) return user;
                }

                return null;
            }
        })
    ]
} satisfies NextAuthConfig

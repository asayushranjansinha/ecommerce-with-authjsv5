import prisma from '@/lib/db';
export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                userId
            }
        });
        if (!account) return null;
        return account;

    } catch (error) {
        return null;
    }
}
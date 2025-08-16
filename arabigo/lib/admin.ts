import { auth } from "@clerk/nextjs/server"

const adminIds = [
    "user_2zvQkCCIaREPoEtDdQ7Oy74uBuz",
]; 
export const getIsAdmin = async () => {
    const { userId } = await auth();

    if (!userId){
        return false;
    }
    return adminIds.indexOf(userId) !== -1;
};
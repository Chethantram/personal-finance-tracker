import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
   const user =  await currentUser();

    if (!user || !user?.id) {

        
        return null;
    }
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user?.id,
            },
        });
        if (loggedInUser) {
            return loggedInUser;
            
        }
        const fullName = `${user.firstName} ${user.lastName}`;
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: fullName,
                imageUrl:user.imageUrl
            },
        });
        return newUser;

    } catch (error) {
        console.log(error.message);
        
    }
   
}
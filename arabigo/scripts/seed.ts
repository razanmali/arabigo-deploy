import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon} from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, {schema});

const main = async () => {
    try{
        console.log("Seeding databse");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);

        await db.insert(schema.courses).values([
            {
            id:1,
            title: "Arabic",
            imageSrc: "/ar.svg",


        },
    ]);

    await db.insert(schema.units).values([
        {
            id: 1,
            coursId: 1,
            title: "Unit 1",
            description: "Learn the basics of Arabic",
            order: 1,
        }
    ]);
    //ADDING LESSONS
    await db.insert(schema.lessons).values([
        {
            id: 1,
            unitId: 1,
            order: 1,
             title: "Nouns",
        },
        {
            id: 2,
            unitId: 1,
            order: 2,
             title: "Verbs",
        },
        {
            id: 3,
            unitId: 1,
            order: 3,
             title: "Nouns",
        },
        {
            id: 4,
            unitId: 1,
            order: 4,
             title: "Verbs",
        },
        

    ]);

    // ADDING CHALLENGES
    await db.insert(schema.challenges).values([
        {
            id: 1,
            lessonId: 1,// Nouns
            type: "SELECT",
            order: 1,
            question: 'Which one of these is the "man"?',
        },
        //   {
        //     id: 2,
        //     lessonId: 2,// Verbs
        //     type: "SELECT",
        //     order: 2,
        //     question: 'Which one of these is the "man"?',
        // },
        
    ]);

     await db.insert(schema.challengeOptions).values([
        {
            id: 1,
            challengeId:1,//'Which one of these is the "man"?'
            imageSrc:"/man.svg",
            correct: true,
            text: "رجل",
            audioSrc: "/ar_man.mp3",
        },
        {
            id: 2,
            challengeId:1,
            imageSrc:"/woman.svg",
            correct: false,
            text: "امرأة",
            audioSrc: "/ar_woman.mp3",
        },
        {
            id: 3,
            challengeId:1,
            imageSrc:"/boy.svg",
            correct: false,
            text: "طفل",
            audioSrc: "/ar_boy.mp3",
        },
     ]);


        console.log("Seeding finished");

    } catch(error){
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();
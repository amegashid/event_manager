import redisClient from '../../models/redis/database.js'
import { getAllEventsRule } from '../../models/mongo/event/eventRule.js'
import connectMongo from "../../models/mongo/event/database.js";


async function main() {
    try {
        await connectMongo();
        console.log("Redis producer connected to MongoDB successfully...");

        const eventRules = await getAllEventsRuleAndSendParent();
        process.send({status: 'success', data: eventRules})
    } catch (error) {
        process.send({ status: 'error', message: error });
    }
}
async function getAllEventsRuleAndSendParent() {
    try {
        const eventRules = await getAllEventsRule();
        return eventRules;
    } catch (error) {
        throw new Error(error)
    }
}

main();

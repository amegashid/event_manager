// change data value in redis
import redisClient from '../../models/redis/database.js'

// Connect to database
try {
    await redisClient.connect();
    console.log("Connected to database(change-data child)...");
} catch (error) {
    console.log("Error connecting to database(change-data child): " + error.message);
}


process.on('message', (message) => {
    if (message === 'start'){
        setInterval(main, 5000);
    } else {
        console.error("Unknown message(change-data child):", message);
    }
})


async function main() {
    try {
        const data = await redisClient.get('dataWithEventRule');
        const changedData =  await changData(data);
        await redisClient.set('dataWithEventRule',JSON.stringify(changedData));

        process.send({
            status: "success",
            message: `Changes Data on redis successfully: ${JSON.stringify(changedData)}`,
          });
    } catch (error) {
        process.send({ status: "error", message: error });
    }
}


async function changData(data) {
    const convertToObject = JSON.parse(data);
    convertToObject.forEach(element => {
        const randomValue = Math.floor((Math.random() * 201)) - 100;
        element.value = randomValue;
    });
    return convertToObject
}
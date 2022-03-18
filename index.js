const { MongoClient } = require('mongodb');
const { DB_URI } = require('./config');
const { createDataForAggergation, runAggergationOfMatchGroupSortAndLimit } = require('./src/aggergations/aggregation.examples');
const { runDataForChangeStreams, startMonitorUsingChangeStream } = require('./src/change-streams/change-streams.examples');
const { deleteALL } = require('./src/crud/crud');
const { createMultiple, createOne, findOne, findMultiple, updateOne, upsertOne, updateMultiple, deleteOne, deleteMultiple } = require('./src/crud/crud.examples');
const { createDataForTransiction, createIndex, dropIndex, createDataWithTransiction } = require('./src/transictions/transictions.examples');


const uri = DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function main() {
    try {
        console.log('connecting to database..')
        await client.connect();

        console.log('\nfetching databases names...')
        await listDatabases(client);

        console.log('\n\n//////////////////////////////////////////////////////')
        console.log('starting crud examples:\n');
        await runCrudExamples(client);
        
        console.log('\n\n//////////////////////////////////////////////////////')
        console.log('starting aggergation examples:\n');
        await runAggregationExamples(client);
        
        console.log('\n\n//////////////////////////////////////////////////////')
        console.log('starting change Streams examples:\n');
        await runChangeStreamsExamples(client);
        
        console.log('\n\n//////////////////////////////////////////////////////')
        console.log('starting transictions examples:\n');
        await runTransictionsExamples(client);

    } catch (e) {
        console.error(e);

    } finally {
        console.log('\nclearing db...');
        await deleteALL(client);

        console.log('\nclosing connection...');
        await client.close();
    }

}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function runCrudExamples(client) {
    console.log('\ncreating one note...')
    await createOne(client);

    console.log('\ncreating multiple notes...')
    await createMultiple(client);

    console.log('\nfinding one note...');
    await findOne(client);

    console.log('\nfinding multiple notes...');
    await findMultiple(client);

    console.log('\nupdating one note...');
    await updateOne(client);

    console.log('\nupserting one note...');
    await upsertOne(client);

    console.log('\nupdate multiple notes...');
    await updateMultiple(client);

    console.log('\ndelete one note...');
    await deleteOne(client);

    console.log('\ndelete multiple notes...');
    await deleteMultiple(client);
}

async function runAggregationExamples(client) {
    console.log("\ncreating data for aggergation example...")
    await createDataForAggergation(client);

    console.log("\nrunning aggergation of match, group, sort, and limit...")
    await runAggergationOfMatchGroupSortAndLimit(client);
}

async function runChangeStreamsExamples(client) {

    console.log("\nstart monitoring notes collection...")
    const changeStream = await startMonitorUsingChangeStream(client);

    console.log("\nrunnig data scenarios for change streams example...")
    await runDataForChangeStreams(client);

    console.log("\nstoping monitoring notes...");
    await changeStream.close();
    
}

async function runTransictionsExamples(client) {
    console.log("\ncreating index...");
    const indexId = await createIndex(client);
    
    console.log("\ncreating data for transiction use...");
    await createDataForTransiction(client);
    
    console.log("\ncreating data while running transiction...");
    await createDataWithTransiction(client);
    
    console.log("\ndroping index...");
    await dropIndex(client, indexId);
}

main().catch(console.error);
const { DB_NAME, NOTES_COLLECTION, USERS_COLLECTION } = require("../../config");

exports.createNote = async (client, newNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION).insertOne(newNote);
    console.log(`New note created with the following id: ${result.insertedId}`);

    return result.insertedId;
}

exports.createMultipleNotes = async (client, newNotes) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION).insertMany(newNotes);
    console.log(`${result.insertedCount} new Note(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

exports.findOneNoteByName = async (client, nameOfNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION).findOne({ name: nameOfNote });
    if (result) {
        console.log(`Found a note in the collection with the name '${nameOfNote}':`);
        console.log(result);
    } else {
        console.log(`No notes found with the name '${nameOfNote}'`);
    }
}

exports.findNotesWithMinimumBedroomsBathroomsAndMostRecentReviews = async function (client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db(DB_NAME).collection(NOTES_COLLECTION).find(
        {
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
    ).sort({ last_review: -1 })
        .limit(maximumNumberOfResults);
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found note(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);

        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log(`No notes found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}

exports.updateNote = async (client, noteId, updatedNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION).updateOne({ _id: noteId }, { $set: updatedNote });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

exports.updateOneNoteByName = async (client, nameOfNote, updatedNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .updateOne({ name: nameOfNote }, { $set: updatedNote });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

exports.upsertOneNoteByName = async (client, nameOfNote, updatedNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .updateOne({ name: nameOfNote },
            { $set: updatedNote },
            { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

exports.updateAllNotesToHaveNoteType = async (client) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .updateMany({ note_type: { $exists: false } },
            { $set: { note_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

exports.deleteNote = async (client, noteId) => {
    // See http://bit.ly/Node_deleteOne for the deleteOne() docs
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION).deleteOne({ _id: noteId });

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

exports.deleteOneNoteByName = async (client, nameOfNote) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .deleteOne({ name: nameOfNote });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

exports.deleteNotesScrapedBeforeDate = async (client, date) => {
    const result = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

exports.createMultipleUsers = async (client, newUsers) => {
    const result = await client.db(DB_NAME).collection(USERS_COLLECTION).insertMany(newUsers);

    console.log(`${result.insertedCount} new user(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

exports.deleteALL = async (client) => {
    const notesResult = await client.db(DB_NAME).collection(NOTES_COLLECTION)
        .deleteMany({});
    console.log(`${notesResult.deletedCount} note document(s) was/were deleted.`);

    const usersResult = await client.db(DB_NAME).collection(USERS_COLLECTION)
        .deleteMany({});
    console.log(`${usersResult.deletedCount} note document(s) was/were deleted.`);
}
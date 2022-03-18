const { DB_NAME, USERS_COLLECTION, NOTES_COLLECTION } = require("../../config");

exports.createEmailIndexOnUsers = async (client) => {
    const indexId = await client.db(DB_NAME).collection(USERS_COLLECTION).createIndex({ "email": 1 }, { unique: true });
    console.log(`Index successfully created: ${indexId}`);

    return indexId;
}

exports.dropIndexOnUsers = async (client, indexId) => {
    await client.db(DB_NAME).collection(USERS_COLLECTION).dropIndex(indexId);
    console.log(`Index successfully droped: ${indexId}`)
}

exports.createReservationWithTranscition = async (client, userEmail, nameOfNote, newReservation) => {
    const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION);
    const notesCollection = client.db(DB_NAME).collection(NOTES_COLLECTION);

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    const session = client.startSession();

    try {
        const transactionResults = await session.withTransaction(async () => {
            const usersUpdateResults = await usersCollection.updateOne(
                { email: userEmail },
                { $addToSet: { reservations: newReservation } },
                { session });
            console.log(`${usersUpdateResults.matchedCount} document(s) found in the users collection with the email address ${userEmail}.`);
            console.log(`${usersUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);

            const isNoteReservedResults = await notesCollection.findOne(
                { name: nameOfNote, datesReserved: { $in: newReservation.dates } },
                { session });

            if (isNoteReservedResults) {
                await session.abortTransaction();
                console.error("This note is already reserved for at least one of the given dates. The reservation could not be created.");
                console.error("Any operations that already occurred as part of this transaction will be rolled back.");
                return;
            }

            const notesUpdatesResults = await notesCollection.updateOne(
                { name: nameOfNote },
                { $addToSet: { datesReserved: { $each: newReservation.dates } } },
                { session });
            console.log(`${notesUpdatesResults.matchedCount} document(s) found in the notes collection with the name ${nameOfNote}.`);
            console.log(`${notesUpdatesResults.modifiedCount} document(s) was/were updated to include the reservation dates.`);


        }, transactionOptions);

        if (transactionResults) {
            console.log("The reservation was successfully created.");
        } else {
            console.log("The transaction was intentionally aborted.");
        }
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        await session.endSession();
    }
}

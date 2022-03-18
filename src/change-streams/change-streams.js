const stream = require('stream');
const { ChangeStream } = require("mongodb");
const { DB_NAME, NOTES_COLLECTION } = require('../../config');

const changeStreamMethodEnum = {
    EVENT_EMITTER: 'event_emitter',
    HAS_NEXT: 'has_next',
    STREAM_API: 'stream_api'
};

exports.changeStreamMethodEnum = changeStreamMethodEnum;

exports.monitorNotesUsingEventEmitter = async (client, pipeline = [], method = changeStreamMethodEnum.EVENT_EMITTER) => {
    const collection = await client.db(DB_NAME).collection(NOTES_COLLECTION);
    const changeStream = await collection.watch(pipeline);

    console.log(`\nmonitoring using method: ${method}`);
    switch (method) {
        case changeStreamMethodEnum.EVENT_EMITTER:
            changeStream.on('change', (next) => {
                console.log(next);
            });
            break;

        case changeStreamMethodEnum.HAS_NEXT:
            monitorUsingHasNext(changeStream);
            break;

        case changeStreamMethodEnum.STREAM_API:
            changeStream.stream().pipe(
                new stream.Writable({
                    objectMode: true,
                    write: function (doc, _, cb) {
                        console.log(doc);
                        cb();
                    }
                })
            );
            break;

        default:
            break;
    }

    return changeStream;
}

async function monitorUsingHasNext(changeStream) {
    try {
        while (await changeStream.hasNext()) {
            console.log(await changeStream.next());
        }
    } catch (error) {
        // if (changeStream.isClosed()) {
        //     console.log("The change stream is closed. Will not wait on any more changes.")
        // } else {
        //     throw error;
        // }
    }
}





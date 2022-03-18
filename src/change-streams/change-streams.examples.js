const { monitorNotesUsingEventEmitter, changeStreamMethodEnum } = require("./change-streams");
const { createNote, updateNote, deleteNote } = require("../crud/crud");

exports.runDataForChangeStreams = async (client) => {
    const operaHouseViewsId = await createNote(client, {
        name: "Opera House Views",
        summary: "Beautiful apartment with views of the iconic Sydney Opera House",
        property_type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        address: {
            market: "Sydney",
            country: "Australia"
        }
    });

    const privateRoomInLondonId = await createNote(client, {
        name: "Private room in London",
        property_type: "Apartment",
        bedrooms: 1,
        bathroom: 1
    });

    const beautifulBeachHouseId = await createNote(client, {
        name: "Beautiful Beach House",
        summary: "Enjoy relaxed beach living in this house with a private beach",
        bedrooms: 4,
        bathrooms: 2.5,
        beds: 7,
        last_review: new Date()
    });

    console.log(operaHouseViewsId)
    await updateNote(client, operaHouseViewsId, { beds: 2 });

    await updateNote(client, beautifulBeachHouseId, {
        address: {
            market: "Sydney",
            country: "Australia"
        }
    });

    const italianVillaId = await createNote(client, {
        name: "Italian Villa",
        property_type: "Entire home/apt",
        bedrooms: 6,
        bathrooms: 4,
        address: {
            market: "Cinque Terre",
            country: "Italy"
        }
    });

    const sydneyHarbourHome = await createNote(client, {
        name: "Sydney Harbour Home",
        bedrooms: 4,
        bathrooms: 2.5,
        address: {
            market: "Sydney",
            country: "Australia"
        }
    });

    await deleteNote(client, sydneyHarbourHome);
}

exports.startMonitorUsingChangeStream = async (client) => {
    const pipeline = [
        {
            '$match': {
                'operationType': 'insert',
                'fullDocument.address.country': 'Australia',
                'fullDocument.address.market': 'Sydney'
            },
        }
    ];

    const changeStream = await monitorNotesUsingEventEmitter(client, pipeline, changeStreamMethodEnum.STREAM_API);

    return changeStream;
}
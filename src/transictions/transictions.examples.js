const { createMultipleUsers, createNote } = require("../crud/crud");
const { createEmailIndexOnUsers, dropIndexOnUsers, createReservationWithTranscition } = require("./transictions");

exports.createDataForTransiction = async (client) => {
    await createMultipleUsers(client, [
        {
            email: "leslie@example.com",
            name: "Leslie Yepp"
        },
        {
            email: "april@example.com",
            name: "April Ludfence"
        },
        {
            email: "tom@example.com",
            name: "Tom Haverdodge"
        }
    ]);

    await createNote(client, {
        name: "Infinite Views1",
        summary: "A charming loft in Paris1",
        bedrooms: 2,
        bathrooms: 2
    });


}

exports.createIndex = async (client) => {
    const indexId = await createEmailIndexOnUsers(client);

    return indexId;
}

exports.dropIndex = async (client, indexId) => {
    await dropIndexOnUsers(client, indexId);
}

exports.createDataWithTransiction = async (client) => {
    const userEmail = "leslie@example.com";
    const nameOfNote = "Infinite Views1";
    const newReservation = {
        name: 'Infinite Views',
        dates: [new Date("2019-12-31"), new Date("2020-01-01")],
        pricePerNight: 180,
        specialRequests: 'Late checkout',
        breakfastIncluded: true
    }


    await createReservationWithTranscition(client, userEmail, nameOfNote, newReservation);
}
const { createNote, createMultipleNotes, findOneNoteByName, findNotesWithMinimumBedroomsBathroomsAndMostRecentReviews, updateOneNoteByName, upsertOneNoteByName, updateAllNotesToHaveNoteType, deleteOneNoteByName, deleteNotesScrapedBeforeDate } = require("./crud");

exports.createOne = async (client) => {
    await createNote(client, {
        name: "Lovely Loft",
        summary: "A charming loft in Paris",
        bedrooms: 1,
        bathrooms: 1
    });
}

exports.createMultiple = async (client) => {
    await createMultipleNotes(client, [
        {
            name: "Infinite Views",
            summary: "Modern home with infinite views from the infinity pool",
            property_type: "House",
            bedrooms: 5,
            bathrooms: 4.5,
            beds: 5
        },
        {
            name: "Private room in London",
            property_type: "Apartment",
            bedrooms: 1,
            bathroom: 1
        },
        {
            name: "Beautiful Beach House",
            summary: "Enjoy relaxed beach living in this house with a private beach",
            bedrooms: 4,
            bathrooms: 2.5,
            beds: 7,
            last_review: new Date()
        }
    ]);
}


exports.findOne = async (client) => {
    await findOneNoteByName(client, "Infinite Views");
}

exports.findMultiple = async (client) => {
    await findNotesWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
        minimumNumberOfBedrooms: 4,
        minimumNumberOfBathrooms: 2,
        maximumNumberOfResults: 5
    });
}

exports.updateOne = async (client) => {
    await updateOneNoteByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });
}

exports.upsertOne = async (client) => {
    await upsertOneNoteByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 1 });
}

exports.updateMultiple = async (client) => {
    await updateAllNotesToHaveNoteType(client);
}

exports.deleteOne = async (client) => {
    await deleteOneNoteByName(client, "Cozy Cottage");
}

exports.deleteMultiple = async (client) => {
    await deleteNotesScrapedBeforeDate(client, new Date("2019-02-15"));
}


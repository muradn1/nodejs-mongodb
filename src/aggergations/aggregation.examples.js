const faker = require('faker');
const { DB_NAME, NOTES_COLLECTION } = require('../../config');
const { createMultipleNotes } = require('../crud/crud');

exports.createDataForAggergation = async (client) => {
    const COUNTRIES = ['USA', 'Qatar', 'Cuba', 'France'];
    const newNotes = [];
    for (let i = 0; i < 100; i++) {
        const bedrooms = Math.floor(Math.random() * 4) + 1; //between 1 -> 10
        const bathrooms = Math.floor(Math.random() * 3) + 1; //between 1 -> 10
        const price = parseInt(faker.commerce.price());
        const address = {
            country: COUNTRIES[i % 4],
            zipCode: (i > 4) ? faker.address.zipCode() : "", // we want to select only exisitng zipCode
        }

        if (i < 2) {
            delete address.zipCode;
        }

        newNotes.push({ bedrooms, bathrooms, price, address });

    }
    await createMultipleNotes(client, newNotes);
}

exports.runAggergationOfMatchGroupSortAndLimit = async (client) => {
    await printCheapestCountriesWithZipCode(client, 2, 2);
}

const printCheapestCountriesWithZipCode = async (client, bedroomsNum = 1, maxNumberToPrint = 3) => {
    const pipeline = [
        {
            '$match': {
                'bedrooms': bedroomsNum,
                'address.zipCode': {
                    '$exists': 1,
                    '$ne': ''
                }
            }
        }, {
            '$group': {
                '_id': '$address.country',
                'averagePrice': {
                    '$avg': '$price'
                }
            }
        }, {
            '$sort': {
                'averagePrice': 1
            }
        }, {
            '$limit': maxNumberToPrint
        }
    ];

    const aggCursor = await client.db(DB_NAME)
        .collection(NOTES_COLLECTION)
        .aggregate(pipeline);

    console.log('\nthe cheapest countries:')
    await aggCursor.forEach(note => {
        console.log(`${note._id}: ${note.averagePrice}`);
    });
}


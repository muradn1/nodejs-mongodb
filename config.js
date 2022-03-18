const USERNAME ='murad1';
const PASSWORD = '12345';
const DB_NAME = 'mysandbox';

exports.DB_NAME = DB_NAME;
exports.NOTES_COLLECTION = 'notes';
exports.USERS_COLLECTION = 'users';

exports.DB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${DB_NAME}.oo54f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

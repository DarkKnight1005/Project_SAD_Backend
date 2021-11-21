const MongoClient = require('mongodb').MongoClient
const urls = require("/Users/ayazpanahov/Desktop/Project_SAD_Backend/urls/db_urls.js");

class Connection {

    static async open() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url, this.options)
        return this.db
    }

}

Connection.db = null
Connection.url = urls.db_url
Connection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser:    true,
    // useUnifiedTopology: true,
}

module.exports = { Connection }
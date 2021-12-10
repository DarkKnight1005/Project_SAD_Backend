const MongoClient = require('mongodb').MongoClient

const urls = require("../urls/db_urls.js");

class DbConnection {

    static async open() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url, this.options)
        return this.db
    }

}

DbConnection.db = null
DbConnection.url = urls.db_url
DbConnection.options = {
    // bufferMaxEntries:   0,
    // reconnectTries:     5000,
    useNewUrlParser:    true,
    // useUnifiedTopology: true,
}

module.exports = { DbConnection }
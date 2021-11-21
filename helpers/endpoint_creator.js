class EndpointCreator{
    constructor(persistentPath){
        this.persistentPath = persistentPath;
    }

    constructEndpoint(additionalPath) {
        return this.persistentPath + "/" + additionalPath;
    }
}

module.exports = { EndpointCreator }
const endpointCreator = require('/Users/ayazpanahov/Desktop/Project_SAD_Backend/helpers/endpoint_creator.js')

class Endpoint{

    constructor(){};
    //Base Endpoint
    api_path = "api";
    //

    //Main Endpints
    EndpointCreatorMain = new endpointCreator.EndpointCreator(this.api_path);

    auth_path = this.EndpointCreatorMain.constructEndpoint("auth");
    //
    
    //Derived Endpoints
    //Auth
    EndpointCreatorSub = new endpointCreator.EndpointCreator(this.auth_path);

    signIn = this.EndpointCreatorSub.constructEndpoint("signIn")
    //
    //

    login_path = ""
}

module.exports = { Endpoint };
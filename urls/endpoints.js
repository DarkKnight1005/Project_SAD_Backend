// var normalizedPath = require("path").join(__dirname, "helpers");

const endpointCreator = require('../helpers/endpoint_creator.js')

class Endpoint{

    constructor(){};
    //Base Endpoint
    api_path = "/sad_project_api";
    //

    //Main Endpints
    EndpointCreatorMain = new endpointCreator.EndpointCreator(this.api_path);

    auth_path = this.EndpointCreatorMain.constructEndpoint("auth");
    explore_path = this.EndpointCreatorMain.constructEndpoint("explore");
    quiz_path = this.EndpointCreatorMain.constructEndpoint("quiz");
    //
    
    //Derived Endpoints
    //Auth
    EndpointCreatorSubAuth = new endpointCreator.EndpointCreator(this.auth_path);

    signIn = this.EndpointCreatorSubAuth.constructEndpoint("signIn");

    register = this.EndpointCreatorSubAuth.constructEndpoint("register");
    //

    //Explore
    EndpointCreatorSubExplore = new endpointCreator.EndpointCreator(this.explore_path);

    restaraunts = this.EndpointCreatorSubExplore.constructEndpoint("restaraunts");

    monuments = this.EndpointCreatorSubExplore.constructEndpoint("monuments");

    //Quiz
    EndpointCreatorSubQuiz = new endpointCreator.EndpointCreator(this.quiz_path);

    question = this.EndpointCreatorSubQuiz.constructEndpoint("question");

    checkResults = this.EndpointCreatorSubQuiz.constructEndpoint("checkResults");

    //
    //
    //

}

module.exports = { Endpoint };
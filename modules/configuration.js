module.exports = {
    mongodb: {
        //if need to auth, the URI of env is:
        //mongodb://admin:passw0rd@localhost:27017/cognitive_solution?authMechanism=DEFAULT
        uri: process.env.MongoDB_URI || "mongodb://localhost:27017/cognitive_solution"
    },
    Context_Path: process.env.Context_Path || "/cs"
};
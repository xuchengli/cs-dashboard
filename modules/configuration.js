module.exports = {
    cookieName: "csda", //Cognitive Solution Dashboard Account
    SV_BaseURL: process.env.SV_BaseURL || "https://ptopenlab.com/cloudlab/api/",
    mongodb: {
        //if need to auth, the URI of env is:
        //mongodb://admin:passw0rd@localhost:27017/cognitive_solution?authMechanism=DEFAULT
        uri: process.env.MongoDB_URI || "mongodb://localhost:27017/cognitive_solution"
    },
    Context_Path: process.env.Context_Path || "/cs",
    AI_VISION: {
        api: process.env.AI_VISION_API || "http://9.186.91.76:8080/vision-service/api",
        admin: {
            id: "vbadmin",
            password: "vbadminpassw0rd"
        }
    }
};

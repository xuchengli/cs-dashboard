module.exports = {
    cookieName: "csda", //Cognitive Solution Dashboard Account
    tokenCookie: "token",
    SV_BaseURL: process.env.SV_BaseURL || "https://ptopenlab.com/cloudlab/api/",
    mongodb: {
        //if need to auth, the URI of env is:
        //mongodb://admin:passw0rd@localhost:27017/cognitive_solution?authMechanism=DEFAULT
        uri: process.env.MongoDB_URI || "mongodb://localhost:27017/cognitive_solution"
    },
    Context_Path: process.env.Context_Path || "/cs",
    VIDEO_STORE_PATH: process.env.VIDEO_STORE_PATH || "/data",
    AI_VISION: {
        api: process.env.AI_VISION_API || "http://9.186.106.206:9080/powerai-vision/api",
        admin: {
            id: "vbadmin",
            password: "vbadminpassw0rd"
        }
    },
    Video_Stream_API: process.env.Video_Stream_API || "http://9.186.106.206:8085/video-insight/api"
};

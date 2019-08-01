const Model = require('../models/ServiceLogModel/ServiceLogModel');

module.exports = async (req, res, next) => {
    const msTeamsWebhook = "adrres@microsoft.com"//process.env.MSTEAMS_WEBHOOK;

    const category = req.url.split('/')[1];
    
    req.serviceLog = { user: "user.lastname@niceincontact.com", username: "user.lastname", category, success: true }

    res.on("finish", async function(){
        if (req.method.toLowerCase() !== "get") {
            try {
                if (req.serviceLog.message) {
                    await new Model(req.serviceLog).save();
                }
            } catch (err) {
                console.log("Error", err);
            }
        }
    });

    next();
}
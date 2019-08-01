const axios = require('axios');

module.exports = async (req, res, next) => {

    res.on("finish", function () {
        if (req.method.toLowerCase() !== "get") {
            try {
                const failedColor = "ff0000";
                const successColor = "00d761";
                let { action, username, message, error, success, category } = req.serviceLog
                let status = success ? "Success" : "Failed";
                let messageText = `<b>Username:</b> ${username}<br/>`;
                messageText += `<b>Message:</b> ${message}<br/>`;
                if (error) {
                    messageText += `<hr/>`;
                    // messageText += `<b>Stack</b>: ${error.replace("\n", "<br/>")}<br/>`;
                }

                let body = {
                    "@type": "MessageCard",
                    "themeColor": req.serviceLog.success ? successColor : failedColor,
                    "title": `[${category}] - ${action} - ${status}`,
                    "text": messageText
                };
                // let response = await axios.post(msTeamsWebhook, body);
                console.log('msTeamsWebhook \n', body);
            } catch (err) {
                console.log("Error", err);
            }
        }
    });

    next();
}
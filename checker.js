const USERS = require("./models/users")

class CLOCK {
    constructor() { }
    async start() {
        setInterval(async () => {
            if(new Date().getDate() == 1){
                await (await USERS.find({ })).map(user => {
                    user.deleteOne();
                })
            }
        }, 5 * 60000)
    }
}

module.exports = CLOCK;
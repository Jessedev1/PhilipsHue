class Configuration extends Request {

    constructor(username) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async createUser(device_name) {
        const request = await this.request('POST', '', {
            devicetype: `${this.settings.application_name}#${device_name}`
        });

        if (request.success) {
            if (request.data[0].success) {
                this.username = request.data[0].success.username;
                return {success: true, username: request.data[0].success.username};
            } else {
                return {success: true, message: request.data[0].error.description};
            }
        } else {
            return {success: false, message: "Something went wrong while adding a new user to the whitelist."};
        }

    }

    async getConfiguration() {
        const request = await this.request('GET', `${this.username}/config`);

        if (request.success) {
            console.log(request.data);
        } else {
            return {success: false, message: "Er is iets misgegaan tijdens het ophalen van de configuratie."};
        }
    }

    async setConfiguration(configuration = {}) {
        const request = await this.request('PUT', `${this.username}/config`, configuration);

    }

    async getAllData() {
        const request = await this.request('GET', `${this.username}`);
    }
}

module.exports = Configuration;
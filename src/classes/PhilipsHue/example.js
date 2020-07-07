class Example extends Request {

    constructor(username) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async get(id) {
        const request = this.request('GET', `endpoint/${id}`, {name: "Jesse"}, {});

        if (request.success) {
            return request.data;
        } else {
            return [];
        }
    }

}

module.exports = Example;
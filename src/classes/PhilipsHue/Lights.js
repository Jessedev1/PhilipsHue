class Lights extends Request {

    constructor(username = null) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async get(light_identifier = null) {
        //Call to lights endpoint of PhilipsHue API
        const request = await this.request('GET', `${this.username}/lights${(!!light_identifier) ? `/${light_identifier}` : ``}`);

        if (request.success) {
            let data = request.data;

            const lights = [];
            _.each(data, (lamp, index) => {
                lights.push({
                    identifier: index,
                    uuid: lamp.uniqueid,
                    productid: lamp.productid,
                    name: lamp.name,
                    type: lamp.type,
                    state: {
                        on: lamp.state.on,
                        brightness: lamp.state.bri,
                        hue: lamp.state.hue,
                        saturation: lamp.state.sat,
                        reachable: lamp.state.reachable
                    },
                    software: {
                        version: lamp.swversion,
                        config_id: lamp.swconfigid,
                        update: {
                            state: lamp.swupdate.state,
                            last_update: lamp.swupdate.lastinstall
                        }
                    },
                })
            });

            return lights;
        }

        return [];
    }

    async getNew() {
        const request = await this.request('GET', `${this.username}/lights/new`);

        if (request.success) {
            const data = request.data;

            if (data.lastscan === 'none') {
                return {success: false, message: "To be able to get new lights you have to search them first."}
            }

            if (data.lastscan === 'active') {
                return {success: false, message: "The Philips hue brige is currently searching for new lights."}
            }

            if (_.size(data) > 1) {
                return data;
            } else {
                return {success: false, message: "Couldn't find new devices."}
            }
        }

        return [];
    }

    async search() {
        const request = await this.request('POST', `${this.username}/lights`);
        if (request.success) {
            const data = request.data;

            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, message: "Searching for new devices."}
            }
        }
        return {success: false, message: "Could not search for new devices."}
    }

    async getAttributes(light_identifier = null) {
        const request = await this.request('GET', `${this.username}/lights/${light_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0] && data[0].error) return [];
            return data;
        } else {
            return [];
        }
    }

    async setAttributes(light_identifier = null, attributes = {}) {
        const request = await this.request('PUT', `${this.username}/lights/${light_identifier}`, attributes);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "Attributes have been updated successfully."}
            }
        } else {
            return {success: false, message: "Something went wrong while updating the attributes for light '" + light_identifier + "'."}
        }
    }

    async setState(light_identifier = null, state = {}) {
        const request = await this.request('PUT', `${this.username}/lights/${light_identifier}/state`, state);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "State has been updated successfully."}
            }
        } else {
            return {success: false, message: "Something went wrong while updating the state for light '" + light_identifier + "'."}
        }
    }

    async delete(light_identifier = null) {
        const request = await this.request('DELETE', `${this.username}/lights/${light_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "light has been deleted successfully."}
            }
        } else {
            return {success: false, message: "Something went wrong while deleting light '" + light_identifier + "'."}
        }
    }

}

module.exports = Lights;
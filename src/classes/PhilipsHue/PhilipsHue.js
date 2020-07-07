const Color = require('../../assets/color-js/color');

Lights = require('./Lights.js');

class PhilipsHue extends Request {

    constructor() {
        super();

        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    colorToHsv(color) {
        if (color === "off") return {on: false}
        const jqc = Color(color).toHSV();
        return {
            "on": (((jqc.alpha * 2) * 127.5) !== 0),
            "hue": Math.floor(65535 * jqc.hue / 360),
            "sat": Math.floor(jqc.saturation * 255),
            "bri": Math.round((jqc.alpha * 2) * 127.5)
        }
    }

    async isAuthorized() {
        const request = await this.request('GET', 'newdeveloper');
        if (request.success) {
            return {success: true, authorized: !request.data[0].error}
        } else {
            return {success: false, authorized: false};
        }
    }

    async authorizeDevice(deviceType = null) {
        const request = await this.request('POST', '', {
            devicetype: deviceType
        });

        if (request.success) {
            if (request.data[0].success) {
                this.username = request.data[0].success.username;
                return {success: true, authorized: true, username: request.data[0].success.username};
            } else {
                return {success: true, authorized: false, message: request.data[0].error.description};
            }
        } else {
            return {success: false, authorized: false};
        }
    }

    async lights(username) {
        return new Lights(username);
    }

    async getLights(username = null) {
        const request = await this.request('GET', `${username || this.username}/lights`);

        if (request.success) {
            if (request.data[0] && request.data[0].error) {
                return {success: false, data: [], message: request.data[0].error.description};
            }

            const lights = [];
            _.each(request.data, (lamp, index) => {
                const object = {
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
                }

                lights.push(object);
            });

            return {success: true, data: lights};
        } else {
            return {success: false, data: []};
        }
    }

    async getLight(username = null, light_identifier = null) {
        const request = await this.request('GET', `${username || this.username}/lights/${light_identifier || 1}`);
        if (request.success) {
            if (request.data[0] && request.data[0].error) {
                return {success: false, data: [], message: request.data[0].error.description};
            }

            const lamp = request.data;
            return {
                success: true,
                data: {
                    identifier: light_identifier,
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
                }
            }
        } else {
            return {success: false, data: []};
        }
    }

    async getNewLights(username = null) {
        const request = await this.request('GET', `${username || this.username}/lights/new`);
        if (request.success) {

            const data = request.data;
            console.log(data);

            if (data.lastscan === "none") {
                return {success: false, data: [], message: "To be able to get new lights you have to search them first."}
            } else if (data.lastscan === "active") {
                return {success: false, data: [], message: "The Philips hue brige is currently searching for new lights."}
            } else {
                if (_.size(data) > 1) {
                    return {success: true, data: data}
                } else {
                    return {success: false, data: [], message: "Er zijn geen nieuwe lampen gevonden."}
                }
            }

        } else {
            return {success: false, data: []};
        }
    }

    async updateLight(username = null, light_identifier = null, data = {}) {
        const request = await this.request('PUT', `${username || this.username}/lights/${light_identifier || 1}`, data);
        if (request.success) {
            if (request.data[0].error) {
                return {success: false, data: [], message: request.data[0].error.description}
            }

            return {success: true, data: request.data}
        } else {
            return {success: false, data: []};
        }
    }

    async updateLightState(username = null, light_identifier = null, state = {}) {
        const request = await this.request('PUT', `${username || this.username}/lights/${light_identifier || 1}/state`, state);

        if (request.success) {
            if (request.data[0].error) {
                return {success: false, data: [], message: request.data[0].error.description};
            }

            return {success: true, data: request.data};
        } else {
            return {success: false, data: []};
        }
    }

    async deleteLight(username = null, light_identifier = null) {
        const request = await this.request('DELETE', `${username || this.username}/lights/${light_identifier || 1}`);
        if (request.success) {
            if (request.data[0].error) {
                return {success: false, data: [], message: request.data[0].error.description};
            }

            return {success: true, data: request.data};
        } else {
            return {success: false, data: []};
        }
    }
}

module.exports = PhilipsHue;
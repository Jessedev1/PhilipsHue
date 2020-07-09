const Color = require('../../assets/color-js/color');

Lights = require('./Lights.js');
Groups = require('./Groups.js');
Schedules = require('./Schedules.js');


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

    async groups(username) {
        return new Groups(username);
    }

    async schedules(username) {
        return new Schedules(username);
    }
}

module.exports = PhilipsHue;
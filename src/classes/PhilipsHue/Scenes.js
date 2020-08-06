class Scenes extends Request {

    constructor(username) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async get(scene_identifier = null) {
        const request = await this.request('GET', `${this.username}/scenes${(!!scene_identifier) ? `/${scene_identifier}` : ``}`);

        if (request.success) {
            const data = request.data;

            let scenes = [];
            const keys = Object.keys(data);
            _.each(keys, (key) => {
                const scene = data[key];

                scenes.push({
                    identifier: key,
                    name: scene.name,
                    type: scene.type,
                    group: scene.group,
                    lights: scene.lights,
                    recycle: scene.recycle,
                    locked: scene.locked,
                    last_updated: scene.lastupdated,
                    version: scene.version
                });
            });

            return scenes;
        } else {
            return [];
        }
    }

    async create(data = {}) {
        const request = await this.request('POST', `${this.username}/scenes`, data);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description};
            } else {
                return {success: true, message: `A new scene has been created.`};
            }

        } else {
            return {success: false, message: "Something went wrong while creating a new scene."};
        }
    }

    async getAttributes(schedule_identifier = null) {
        const request = await this.request('GET', `${this.username}/schedules/${schedule_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0] && data[0].error) return [];
            return data;
        } else {
            return {};
        }
    }

    async setAttributes(schedule_identifier = null, attributes = {}) {
        const request = await this.request('PUT', `${this.username}/schedules/${schedule_identifier}`, attributes);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "Attributes have been updated successfully."}
            }
        } else {
            return {success: false, message: "Something went wrong while updating the attributes for schedule '" + schedule_identifier + "'."}
        }
    }

    async delete(schedule_identifier = null) {
        const request = await this.request('DELETE', `${this.username}/schedules/${schedule_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "Schedule has been deleted successfully."}
            }
        } else {
            return {success: false, message: `Something went wrong while deleting schedule '${schedule_identifier}'.`}
        }
    }
}

module.exports = Scenes;
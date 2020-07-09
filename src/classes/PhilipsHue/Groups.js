class Groups extends Request {

    constructor(username) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async get(group_identifier = null) {
        const request = await this.request('GET', `${this.username}/groups${(!!group_identifier) ? `/${group_identifier}` : ``}`);

        if (request.success) {
            let data = request.data;

            let groups = [];
            const keys = Object.keys(data);
            _.each(keys, value => {
                const group = data[value];
                groups.push({
                    name: group.name,
                    type: group.type,
                    lights: group.lights,
                    action: {
                        on: group.action.on,
                        bri: group.action.bri,
                        hue: group.action.hue,
                        sat: group.action.sat,
                    }
                });
            });

            return groups;
        } else {
            return [];
        }
    }

    async create(data) {
        const request = await this.request('POST', `${this.username}/groups`, data);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                const group_id = data[0].success.id;
                return {success: true, message: `Er is een nieuwe groep aangemaakt met id: ${group_id}.`}
            }

        } else {
            return {success: false, message: "Something went wrong while creating a new group"};
        }
    }

    async getAttributes(group_identifier = null) {
        const request = await this.request('GET', `${this.username}/groups/${group_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0] && data[0].error) return [];
            return data;
        } else {
            return {};
        }
    }

    async setAttributes(group_identifier = null, attributes = {}) {
        const request = await this.request('PUT', `${this.username}/groups/${group_identifier}`, attributes);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "Attributes have been updated successfully."}
            }
        } else {
            return {success: false, message: "Something went wrong while updating the attributes for group '" + group_identifier + "'."}
        }
    }

    async setState(group_identifier = null, state = {}) {
        const request = await this.request('PUT', `${this.username}/groups/${group_identifier}/action`, state);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "State has been updated successfully."}
            }
        } else {
            return {success: true, message: `Something went wrong while updating the state for group '${group_identifier}'.`};
        }
    }

    async delete(group_identifier = null) {
        const request = await this.request('DELETE', `${this.username}/groups/${group_identifier}`);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description}
            } else {
                return {success: true, data: data[0].success, message: "Group has been deleted successfully."}
            }
        } else {
            return {success: false, message: `Something went wrong while deleting group '${group_identifier}'.`}
        }
    }
}

module.exports = Groups;
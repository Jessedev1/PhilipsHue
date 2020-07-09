class Schedules extends Request {

    constructor(username) {
        super();

        this.username = username;
        this.settings = Config.settings;
        this.setAPIUrl(`http://${this.settings.bridge_address}/api`);
    }

    async get(schedule_identifier = null) {
        const request = await this.request('GET', `${this.username}/schedules${(!!schedule_identifier) ? `/${schedule_identifier}` : ``}`);

        if (request.success) {
            const data = request.data;

            let schedules = [];
            const keys = Object.keys(data);
            _.each(keys, value => {
                const schedule = data[value];

                schedules.push({
                    name: schedule.name,
                    status: schedule.status,
                    description: schedule.description,
                    start_time: schedule.starttime,
                    created_at: schedule.created,
                    request: {
                        method: schedule.command.method,
                        address: `http://${this.settings.bridge_address}${schedule.command.address}`,
                        body: schedule.command.body,
                    }
                })
            });

            return schedules;
        } else {
            return [];
        }
    }

    async create(data = {}) {
        const request = await this.request('POST', `${this.username}/schedules`, data);

        if (request.success) {
            const data = request.data;
            if (data[0].error) {
                return {success: false, data: [], message: data[0].error.description};
            } else {
                return {success: true, message: `A new schedule has been created.`};
            }

        } else {
            return {success: false, message: "Something went wrong while creating a new schedule."};
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

module.exports = Schedules;
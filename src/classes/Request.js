class Request {

    constructor() {
        this.api_url = "";
    }

    /**
     * This method will make all the calls to the endpoint including authentication
     *
     * @param {string} method GET,POST,PATCH,DELETE
     * @param {string} endpoint API Endpoint
     * @param {object} data Data object
     * @param {object} params Params object
     */
     async request(method, endpoint, data = {}, params = false) {
        if (!this.api_url) return {success: false, message: "API_URL cannot be null"};

        let result = await new Promise( (resolve, reject) => {
            axios({
                method,
                url: `${this.api_url}/${endpoint}${(params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : '')}`,
                data: data
            }).then(result => resolve({ success: true, data: result.data })).catch(error => { resolve({ success: false, data: error }) });
        });

        return result;
    }

    /**
     * This method will set the API Url. This is needed to perform a request.
     *
     * @param api_url
     */
    async setAPIUrl (api_url) {
        this.api_url = api_url;
        return this.api_url;
    }
}

module.exports = Request;
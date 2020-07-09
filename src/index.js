require(process.cwd() + '/includes.js');

let username = "6Iv4Q2EMpwRvLZ17ejdtHn61KoYTbp9adBTp27wq";

//Define PhilipsHue constructor with bridge ipaddress.
const hue = new PhilipsHue();

(async function start() {
    const conf = await hue.configuration(username);

    console.log(await conf.getConfiguration());
})();
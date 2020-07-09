require(process.cwd() + '/includes.js');

let username = "6Iv4Q2EMpwRvLZ17ejdtHn61KoYTbp9adBTp27wq";

//Define PhilipsHue constructor with bridge ipaddress.
const hue = new PhilipsHue();

(async function start() {
    const schedules = await hue.schedules(username);

    console.log(await schedules.getAttributes(1));
})();
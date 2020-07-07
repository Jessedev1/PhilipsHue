require(process.cwd() + '/includes.js');

let username = "6Iv4Q2EMpwRvLZ17ejdtHn61KoYTbp9adBTp27wq";

//Define PhilipsHue constructor with bridge ipaddress.
const hue = new PhilipsHue();

(async function start() {
    const lights = await hue.lights(username);
    // console.log(await lights.delete(4))
})();
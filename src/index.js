require(process.cwd() + '/includes.js');

let username = "6Iv4Q2EMpwRvLZ17ejdtHn61KoYTbp9adBTp27wq";

//Define PhilipsHue constructor with bridge ipaddress.
const hue = new PhilipsHue();

(async function start() {
    const groups = await hue.groups(username);

    console.log(await groups.delete(6));
})();
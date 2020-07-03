const service = "ngrok";
(async () => {
    const pathRes = require("path").resolve;
    const fetch = require("node-fetch");
    process.env.PATH = process.env.PATH.concat(`:${pathRes("./jre")}:${pathRes("./jre/bin")}`);
    process.chdir("./mc");
    const {spawn} = require("child_process");
    let mcsrv = spawn("java", ["-Xmx1G", "-Xms1G", "-jar", "server.jar", "nogui"]);
    mcsrv.stdout.on("data", (a) => {console.log(a.toString().trim())});
    mcsrv.stderr.on("data", (a) => {console.log(a.toString().trim())});
    mcsrv.on("close", () => {
        process.exit(0);
    })
    process.stdin.pipe(mcsrv.stdin);
    var url;
    if (service == "ngrok") {
        const ngrok = require("ngrok");
        url = await ngrok.connect({
            proto: "tcp",
            addr: 1025,
            region: process.env.ngrok_region,
            authtoken: process.env.ngrok_token
        });
    } else if (service == "serveo") {
        let urlgrab = () => {
            return new Promise((resolve, reject) => {
                try {
                    let sshsrv = spawn("ssh", ["-o", "StrictHostKeyChecking=no", "-R", "1025:localhost:1025", "test@serveo.net"]);
                    sshsrv.stdout.on("data", (data) => {
                        data = require("uncolor")(data.toString().trim());
                        if (data.includes("Forwarding TCP connections from ")) {
                            resolve("tcp://".concat(data.replace("Forwarding TCP connections from ", "").trim()));
                        }
                        console.log(data);
                    });
                    sshsrv.stderr.on("data", (a) => {console.log(a.toString().trim())});
                } catch (err) {
                    return reject(err);
                }
            });
        };
        url = await urlgrab();
    } else {
        throw new Error(`${service} is not serveo or ngrok`);
        process.exit(1);
    }
    console.log(url);
    var res = await fetch("https://mikeylab-dns-gateway--letsrepl.repl.co/dns", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "token": process.env.SERVER_TOKEN,
            "name": process.env.SERVER_DOT,
            "url": url
        })
    });
    res = await res.text();
})();
"";
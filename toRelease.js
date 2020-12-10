(async () => {
    if (!window.location.protocol.includes("https")) window.location.protocol = "https:";
    else {
        let url = new URL(window.location);
        if (url.pathname.lastIndexOf(".html") == url.pathname.length - 5) url.pathname += "/..";
        let arr = url.pathname.split("/");
        let split = [];
        for (let i of arr)
            if (i != "")
                split.push(i);
        let file = split[split.length - 1];
        const loc = `https://github.com/hieyou1/mikeylabfiles/releases/download/${file}/${file}`;
        if (url.searchParams.has("raw")) {
            window.location.href = loc;
        } else {
            // video.js
            let style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = "https://vjs.zencdn.net/7.10.2/video-js.css";
            await new Promise((resolve) => {
                style.onload = resolve;
            });
            window.HELP_IMPROVE_VIDEOJS = false;
            const videojs = await import("https://cdn.skypack.dev/video.js");
            window.HELP_IMPROVE_VIDEOJS = false;
            // mime typing support
            const mime = await import("https://cdn.skypack.dev/mime/lite");
            let type = mime.getType(file);
            const typeIs = (ltype) => {
                return (type.indexOf(`${ltype}/`) == 0);
            }
            const mbody = ((document.getElementById("mbody")) ? document.getElementById("mbody") : document.body);
            if (typeIs("video")) {
                let video = document.createElement("video-js");
                video.controls = true;
                video.src = loc;
                mbody.innerHTML = "";
                mbody.appendChild(video);
                videojs(video);
                mbody.innerHTML += `<br /><div>Video doesn't work? <br /><a href="${loc}">Just download it.</a></div>`;
                document.title = "File";
            } else if (typeIs("audio")) {
                let audio = document.createElement("audio");
                audio.controls = true;
                audio.src = loc;
                mbody.innerHTML = "";
                mbody.appendChild(audio);
                document.title = "File";
            } else if (typeIs("image")) {
                let image = document.createElement("img");
                image.src = loc;
                var clickRan = false;
                image.onclick = () => {
                    if (!clickRan) image.requestFullscreen();
                    clickRan = true;
                    image.onclick = undefined;
                };
                mbody.innerHTML = "";
                mbody.appendChild(image);
                document.title = "File";
            } else window.location.href = loc;
        }
    }
})();
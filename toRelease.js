let url = new URL(window.location);
if (url.pathname.lastIndexOf(".html") == url.pathname.length - 5) url.pathname += "/..";
let arr = url.pathname.split("/");
let split = [];
for (let i of arr)
    if (i != "")
        split.push(i);
let file = split[split.length - 1];
window.location.href = `https://github.com/hieyou1/mikeylabfiles/releases/${file}/${file}`;
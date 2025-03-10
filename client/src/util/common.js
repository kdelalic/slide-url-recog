export const GetClickableLink = (link) => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
};

export const Base64NewTab = (base64URL) => {
    const win = window.open();
    win.document.write(`<style nonce="12402934">body {margin: 0;} iframe {border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;}</style>`);
    win.document.write(`<iframe src="${base64URL}" frameborder="0" allowfullscreen />`);
}

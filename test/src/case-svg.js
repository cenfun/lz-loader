const xml = require('./asserts/icons.svg');
let index = 1;
const init = function() {
    if (index > 10) {
        return;
    }
    //console.log(xml);
    const className = 'svg-icons';
    let holder = document.querySelector(`.${className}`);
    if (holder) {
        return true;
    }

    //console.log("create");
    holder = document.createElement('div');
    holder.className = className;
    holder.style.display = 'none';
    holder.innerHTML = xml;
    if (document.body) {
        document.body.appendChild(holder);
        return;
    }
    index += 1;
    setTimeout(function() {
        init();
    }, 100);
};

init();

module.exports = xml;
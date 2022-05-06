let LastModified;
const grabNotif = (lastId) => {
  return fetch("http://localhost:3000/notifications" /**?lastId=" + lastId**/, {
    headers: {
      "if-modified-since": LastModified,
    },
  }).then((res) => {
    LastModified = res.headers.get("Last-Modified");
    if (res.status === 304) return [];
    return res.json();
  });
};

// Technique: on garde toutes les notifs et on filtre celles déjà reçues
//const notifs = {};
// Technique: on sauvegarde le lastId et on demande les notifs avec id > lastId
//let lastId = -1;

function regularPolling() {
  setInterval(() => {
    grabNotif(/**lastId**/).then((data) => {
      const div = document.getElementById("regular");

      for (let { id, title } of data) {
        //if (notifs[id]) continue;
        const notifElement = document.createElement("div");
        const text = document.createTextNode(`${id} - ${title}`);
        notifElement.appendChild(text);
        div.appendChild(notifElement);
        //notifs[id] = { id, title };
        //lastId = id;
      }
    });
  }, 5 * 1000);
}

regularPolling();

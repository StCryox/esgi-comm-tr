let LastModified = "null";

const grabNotif = (/**lastId**/) => {
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

function mountNotif(data) {
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
}
// Technique: on garde toutes les notifs et on filtre celles déjà reçues
//const notifs = {};
// Technique: on sauvegarde le lastId et on demande les notifs avec id > lastId
//let lastId = -1;

function regularPollingV1() {
  setInterval(() => {
    grabNotif(/**lastId**/).then(mountNotif);
  }, 5 * 1000);
}
//regularPollingV1();

function regularPollingV2() {
  setTimeout(() => {
    grabNotif(/**lastId**/).then(mountNotif).then(regularPollingV2);
  }, 5 * 1000);
}
//regularPollingV2();

function longPolling() {
  fetch("http://localhost:3000/notifications_sub")
    .then((res) => res.json())
    .then((data) => mountNotif([data]))
    .then(longPolling);
}

grabNotif().then(mountNotif).then(longPolling);

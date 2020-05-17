import { db } from "./Firebase";

const fetchActivities = (session) => {
  return new Promise((resolve, reject) => {
    const list = [];
    let activitiesRef = db.collection("runs");
    let query = activitiesRef
      .where("user", "==", session.user.uid)
      .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          resolve([]);
        }
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        resolve(list);
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  });
};

const listenChanges = (session, addActivity) => {
  db.collection("runs")
    .where("user", "==", session.user.uid)
    .orderBy("date", "desc")
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newRun = change.doc.data();
          addActivity(newRun);
        }
        if (change.type === "removed") {
          // const newRuns = runs.filter(
          //   (run) => run.date !== change.doc.data().date
          // );
        }
      });
    });
};

export { fetchActivities, listenChanges };

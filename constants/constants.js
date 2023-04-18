import { firestore } from "../api/firebase";
export const subscreen = {
  ongoingTrips: "ongoingTrips",
  archivedTrips: "archivedTrips",
}

export const tripStatus = {
  NotStarted: "Not Started",
  Started: "Started",
  Finished: "Finished"
}
export const usersCollection = firestore.collection('Users');
export const carpoolCollection = firestore.collection('Carpools');
export const chatCollection = firestore.collection("chats")
export const reportCollection = firestore.collection("Reports")
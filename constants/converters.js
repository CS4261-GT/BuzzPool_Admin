import { firestore } from "../api/firebase";
import Carpool from "../model/Carpool";
import User from "../model/User";
import { chatCollection, usersCollection, carpoolCollection } from "./constants";

/**
 * This object uses the firebase interface of datatype conversion
 * This converts a carpool object to a firestore compatible object upon write
 * and converts a firestore compatible object to a carpool object upon read
 */
export var carpoolConverter = {
  toFirestore: function (carpool) {
    // data fields for reference

    // this.departureTime = departureTime
    // this.departureLocation = departureLocation
    // this.destination = destination
    // this.capacity = capacity
    // this.requireDriver = true
    // this.userGTIDs = [gtid]
    // this.isTransactionFinished = false
    // this.isTripFinished = false
    // console.log(carpool);

    // console.log("Carpool to firebase")
    // console.log(carpool)
    return {
      // required fields
      title: carpool.title,

      // timestamp instance at firebase
      departureTime: carpool.departureTime,
      departureLocation: carpool.departureLocation,
      destination: carpool.destination,
      requireDriver: carpool.requireDriver,
      capacity: carpool.capacity,
      userGTIDs: carpool.userGTIDs,
      driverGTID: carpool.driverGTID,
      userIDs: carpool.userIDs,


      // internal fields
      tripStatus: carpool.tripStatus,
      isTransactionFinished: carpool.isTransactionFinished,

    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    // title, 
    // departureTime, 
    // departureLocation, 
    // destination, 
    // requireDriver = true, 
    // capacity = 5, 
    // userGTIDs = [],
    // isTransactionFinished = false, 
    // isTripFinished = false

    // console.log("Carpool from firebase")
    // console.log(data.departureTime.toDate())

    var carpool = new Carpool(

      // required fields
      data.title,

      // timestamp instance at firebase
      data.departureTime.toDate(),
      data.departureLocation,
      data.destination,
      data.requireDriver,
      data.capacity,
      data.userGTIDs,
      data.driverGTID,
      data.userIDs,

      // internal fields
      data.tripStatus,
      data.isTransactionFinished,

    );

    return carpool;
  }
};

/**
 * This object uses the firebase interface of datatype conversion
 * This converts a user object to a firestore compatible object upon write
 * and converts a firestore compatible object to a user object upon read
 */
export var userConverter = {
  toFirestore: function (user) {

    console.log("To firebase")
    console.log(user)

    return {
      email: user.email,
      GTID: user.GTID,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      ongoingTripID: user.ongoingTripID,
      archivedTripID: user.archivedTripID,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    // console.log("From firebase")
    // console.log(data)

    var user = new User(
      data.email,
      data.GTID,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.ongoingTripID,
      data.archivedTripID,
    );

    return user;
  }
};




import { usersCollection, carpoolCollection, reportCollection } from "../constants/constants"
import { userConverter, carpoolConverter } from "../constants/converters"

export const leaveTrip = async (userWithId, carpoolWithId) => {
  console.log("attempt to leave trip")
 
  const ongoingTrips = userWithId.ongoingTripID.filter(trip => {
    // console.log(trip == carpoolWithId.id)
    return !(trip == carpoolWithId.id)
  })

  // console.log(...userWithId.archivedTripID)

  userWithId.ongoingTripID = ongoingTrips

  await usersCollection
    .doc(userWithId._id)
    .withConverter(userConverter)
    .set(userWithId)
    .catch(e => console.error(e.message))

 
  const userIDs = carpoolWithId.userIDs.filter(userID => {
    return !(userID == userWithId._id)
  })
  const userGITDs = carpoolWithId.userGTIDs.filter(userGTID => {
    return !(userGTID == userWithId.GTID)
  })
  carpoolWithId.userIDs = userIDs
  carpoolWithId.userGTIDs = userGITDs

  if (carpoolWithId.driverGTID == userWithId.GTID && !carpoolWithId.requireDriver) {
    carpoolWithId.driverGTID = -1
    carpoolWithId.requireDriver = true
  }


  await carpoolCollection
    .doc(carpoolWithId.id)
    .withConverter(carpoolConverter)
    .set(carpoolWithId)
    .then(() => console.log("success"))
    .catch(e => console.error(e.message))

  console.log(userWithId)
  // carpool remove user

}

export const getReports = async () => {
  var reportList = [];
  await reportCollection
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const reportData = doc.data();
        reportList.push({
          id: doc.id,
          GTID: reportData.GTID,
          email: reportData.email,
          first: reportData.first,
          last: reportData.last,
          message: reportData.message,
          carpoolTitle: reportData.carpoolTitle,
        });
        // console.log(reportData)
      })
    })
    .catch(error => console.error(error.message))
  return reportList
}
export const getUsers = async () => {
  var userList = []
  await usersCollection
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const userData = doc.data();
        userList.push({
          id: doc.id,
          GTID: userData.GTID,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          ongoingTripID: userData.ongoingTripID,
        });
      })
    })
    .catch(error => console.error(error.message))
  return userList
}

/**
* This class returns all the available carpool instances from firestore
* @returns {Promise<CarpoolWithId[]>} all avaialble carpool instances
*/
export const getAllCarpools = async () => {
  var carpools = [];
  await carpoolCollection
    .withConverter(carpoolConverter)
    // .orderBy("departureTime", "asec")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        var carpool = doc.data();
        carpool['id'] = doc.id;
        carpools.push(carpool);
      });
    })
    // .then(()=>console.log(carpools))
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return carpools
}

/**
* This method deletes all reports for a particular user
*/
export const deleteReports = async (GTID) => {
  await reportCollection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        
        const report = doc.data();
        const id = doc.id
        // console.log(report)
        if (report.GTID == GTID) {
          console.log("trying to delete")
          // doc.delete().then(() => console.log("successful delete"))
          // delList.push(id)
          reportCollection.doc(id).delete()
        }
      });
    })
    // .then(()=>console.log(carpools))
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

}

/**
* This method deletes all reports for a particular user
*/
export const deleteOneReport = async (reportId) => {
  await reportCollection
    .doc(reportId)
    .delete()
    .then(() => {
      
      alert("Report deleted")
    })
    // .then(()=>console.log(carpools))
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

}
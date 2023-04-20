import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { text } from "react-native-communications";
import { deleteReports, getAllCarpools, getReports, getUsers, leaveTrip } from "../handlers/handler";
import { usersCollection } from "../constants/constants";

const Card = ({ GTID, email, first, last, message, carpoolTitle }) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [truncatedMessage, setTruncatedMessage] = useState(true); // Add truncatedMessage state
  const [users, setUsers] = useState([]); // State for users data
  const [refreshing, setrefreshing] = useState(false);
  const [singleRefresh, setSingleRefresh] = useState(false)

  const reportMessage =
    "You have been sent a warning for carpool trip: " +
    carpoolTitle +
    ".\nReport Message: [" +
    message +
    "] .\nIf this happens again, you may get blocked or reported to the authority.";

  const userDetails = "GTID: " + GTID + " email: " + email + " Name: " + first + " " + last + "."






  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getUsers().then(userList => {
        console.log(userList)
        setUsers(userList);
        // setLoading(false);
        setrefreshing(false);
        console.log("user list gotten")
      })
    }, 100);
  };

  if (!singleRefresh)
  {
    onRefresh()
    setSingleRefresh(true)
  }
  // useEffect(() => {
  //   const unsubscribe = firestore.collection("Users").onSnapshot((snapshot) => {
  //     const userList = [];
  //     snapshot.forEach((doc) => {
  //       const userData = doc.data();
  //       userList.push({
  //         id: doc.id,
  //         GTID: userData.GTID,
  //         email: userData.email,
  //         firstName: userData.firstName,
  //         lastName: userData.lastName,
  //         ongoingTripID: userData.ongoingTripID,
  //       });
  //     });
  //     setUsers(userList);
  //     setLoading(false);
  //   });

  //   // Unsubscribe from Firestore listener when component unmounts
  //   return () => unsubscribe();
  // }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleWarning = () => {
    console.log(users)
    const matchingUser = users.find((user) => user.GTID === GTID);
    if (matchingUser)
    {
      console.log("Found user!");

      // Check if firestore object is properly initialized

      const userRef = usersCollection.doc(matchingUser.id);

      userRef
        .get()
        .then((doc) => {
          if (doc.exists)
          {
            // Get the current report array
            const currentReport = doc.data().report || [];

            // Update the user document with the updated report array
            userRef
              .update({
                report: [...currentReport, reportMessage],
              })
              .then(() => {
                console.log("User document updated successfully!");
                alert("Message Sent")
                // const textMessage = 

                text(doc.data().phoneNumber.toString(), reportMessage + "\nBuzzpool Service")
              })
              .catch((error) => {
                console.error("Error updating user document: ", error);
              });
              
          } else
          {
            console.error("User document not found!");
          }
        })
        .catch((error) => {
          console.error("Error getting user document: ", error);
        });
    }
  };

  const handleBlock = async () => {
    const matchingUser = users.find((user) => user.GTID === GTID);
    if (matchingUser)
    {
      console.log("Found user!");

      // Check if firestore object is properly initialized

      const userRef = usersCollection.doc(matchingUser.id);
      // userRef._id = matchingUser.id
      // remove user from all ongoing carpools

      userRef
      .get()
      .then(async(doc) => {
        var userData = doc.data()
        userData._id = matchingUser.id
        await getAllCarpools().then(carpools => {
          console.log("trying to get carpools")
          // console.log(carpools)
          console.log(userData)
          for (const carpool in carpools)
          {
            if (userData.ongoingTripID.includes(carpool.id))
            {
              leaveTrip(userData, carpool)
            }
          }
        })
  
        await deleteReports(matchingUser.GTID)
  

        // Delete the user document from Firestore
        // await userRef
        // .delete()
        // .then(() => {
        //   console.log("User document deleted successfully!");

        //   alert("User Deleted")

        //   // Update the userList state to remove the deleted user
        //   setUsers(users.filter(user => user.id !== matchingUser.id));
        // })
        // .catch((error) => {
        //   console.error("Error deleting user document: ", error);
        // });

      })
      
      
    }
  };

  return (
    <TouchableOpacity onPress={toggleModal}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.title}>GTID: {GTID}</Text>
          <Text style={styles.description}>Email: {email}</Text>
          <Text style={styles.description}>First Name: {first}</Text>
          <Text style={styles.description}>Last Name: {last}</Text>
          {truncatedMessage ? ( // Conditionally render truncated or full message
            <Text numberOfLines={2} style={styles.description}>
              Message: {message}
            </Text>
          ) : (
            <Text style={styles.description}>Message: {message}</Text>
          )}
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      // styles={{width: "80%"}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{message}</Text>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.warningButton}
                onPress={handleWarning}
              >
                <Text style={styles.warningButtonText}>Send Warning</Text>
              </TouchableOpacity>
              <View style={styles.actionButtonGap}></View>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => text("4048942500", userDetails)}
              >
                <Text style={[styles.actionButtonText, { fontSize: 12 }]}>
                  Report
                </Text>
              </TouchableOpacity>
              <View style={styles.actionButtonGap}></View>
              <TouchableOpacity
                style={styles.blockButton}
                onPress={handleBlock}
              >
                <Text style={styles.actionButtonText}>Remove User</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const ReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setrefreshing] = useState(false);
  const [singleRefresh, setSingleRefresh] = useState(false)

  /**
   * This function resets carpool data and force rerendering of the UI
   */
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getReports().then(reportList => {

        setReports(reportList);
        setLoading(false);
        setrefreshing(false);
        console.log("gotten all reports")
        console.log(reportList)
      })
    }, 100);
  };

  if (!singleRefresh)
  {
    onRefresh()
    setSingleRefresh(true)
  }

  // Fetch reports data from Firestore
  // useEffect(() => {

  //   // Unsubscribe from Firestore listener when component unmounts
  //   return () => unsubscribe();
  // }, []);

  // Render loading spinner while data is being fetched
  if (loading)
  {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // Render the reports data in a FlatList with Card components
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={reports}
        renderItem={({ item }) => (
          <Card
            GTID={item.GTID}
            email={item.email}
            first={item.first}
            last={item.last}
            message={item.message}
            carpoolTitle={item.carpoolTitle}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />


      {!reports.length &&
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      }
    </KeyboardAvoidingView>
  )

};



const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 2,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // minWidth: "80%"
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    // width: 300, // set the width to your desired value
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  warningButton: {
    backgroundColor: "#FBE106",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  reportButton: {
    backgroundColor: "#1870d5",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  blockButton: {
    backgroundColor: "#FF2800",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  warningButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtonContainer: {
    flexDirection: "row", // Set flexDirection to row to place buttons horizontally
    justifyContent: "flex-end", // Align buttons to the right
    marginTop: 40, // Add margin at the top for spacing
    justifyContent: "center",
  },
  actionButtonGap: {
    width: 10,
  },
});

export default ReportsScreen;

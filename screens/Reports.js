import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../api/firebase";

const Card = ({ GTID, email, first, last, message }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [truncatedMessage, setTruncatedMessage] = useState(true); // Add truncatedMessage state

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleWarning = () => {
    // Implement the action you want to take here
    // This function will be called when the "Take Action" button is pressed
  };

  const handleReport = () => {
    // Implement the action you want to take here
    // This function will be called when the "Take Action" button is pressed
  };

  const handleBlock = () => {
    // Implement the action you want to take here
    // This function will be called when the "Take Action" button is pressed
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
    onPress={handleReport}
  >
    <Text style={styles.actionButtonText}>Report</Text>
  </TouchableOpacity>
  <View style={styles.actionButtonGap}></View>
  <TouchableOpacity
    style={styles.blockButton}
    onPress={handleBlock}
  >
    <Text style={[styles.actionButtonText, {fontSize: 12}]}>Block</Text>
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

  // Fetch reports data from Firestore
  useEffect(() => {
    const unsubscribe = firestore
      .collection("Reports")
      .onSnapshot((snapshot) => {
        const reportList = [];
        snapshot.forEach((doc) => {
          const reportData = doc.data();
          reportList.push({
            GTID: reportData.GTID,
            email: reportData.email,
            first: reportData.first,
            last: reportData.last,
            message: reportData.message,
          });
        });
        setReports(reportList);
        setLoading(false);
      });

    // Unsubscribe from Firestore listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // Render the reports data in a FlatList with Card components
  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={({ item }) => (
          <Card
            GTID={item.GTID}
            email={item.email}
            first={item.first}
            last={item.last}
            message={item.message}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: 300, // set the width to your desired value
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
    justifyContent: 'center'
  },
  actionButtonGap: {
    width: 10,
  },
});

export default ReportsScreen;

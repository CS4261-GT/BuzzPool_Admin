import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../api/firebase";
import { getUsers } from "../handlers/handler";

const Card = ({ GTID, email, firstName, lastName, ongoingTripID }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.title}>GTID: {GTID}</Text>
        <Text style={styles.description}>Email: {email}</Text>
        <Text style={styles.description}>First Name: {firstName}</Text>
        <Text style={styles.description}>Last Name: {lastName}</Text>
        <Button title="More Info" onPress={handleCardPress} />
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ongoing Trips:</Text>
          <FlatList
            data={ongoingTripID}
            renderItem={({ item }) => (
              <View style={styles.modalItemContainer}>
                <Text style={styles.modalDescription}>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const UsersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State for users data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [refreshing, setrefreshing] = useState(false);
  const [singleRefresh, setSingleRefresh] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState(users)

  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getUsers().then(userList => {

        setUsers(userList);
        setLoading(false);
        setrefreshing(false);
        console.log(userList)
        setFilteredUsers(users.filter((user) => {
          const { firstName, lastName, email, GTID } = user;
          const lowerCaseQuery = searchQuery.toLowerCase();
          return ( 
            firstName.toLowerCase().includes(lowerCaseQuery) ||
            lastName.toLowerCase().includes(lowerCaseQuery) ||
            email.toLowerCase().includes(lowerCaseQuery) ||
            user.GTID.toString().includes(lowerCaseQuery)
          )
        }))
      })
  }, 100);
};


if (!singleRefresh)
{
  onRefresh()
  setSingleRefresh(true)
}


// const getUser = async() => {
//   var userList = [];
//   firestore
//   .collection("Users")
//   .onSnapshot((snapshot) => {    
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
//   })
//   return userList
// }




// Fetch users data from Firestore
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

// Filter users based on search query

// });

// Render the users data in a FlatList with Card components
return (
  <View style={styles.container}>
    <TextInput
      style={styles.searchBar}
      placeholder="Search by first name, last name, email, or GTID"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <Card
            GTID={item.GTID}
            email={item.email}
            firstName={item.firstName}
            lastName={item.lastName}
            ongoingTripID={item.ongoingTripID}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    )}
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F0F0F0",
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardBody: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalContainer: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 3, // Adjust this value to reduce the space
    padding: 30,
  },
  modalItemContainer: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalDescription: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 15,
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default UsersScreen;

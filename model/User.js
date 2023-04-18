import { auth } from "../api/firebase"
import { carpoolCollection, usersCollection } from "../constants/constants"
import { userConverter, carpoolConverter } from "../constants/converters"
export default class User {
  constructor(email, GTID, firstName, lastName, phoneNumber, ongoingTripID, archivedTripID) {
    // userId from firebase?
    // can't use current login user's email, because you may be getting information about another person
    this.email = email
    this.GTID = GTID,
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNumber = phoneNumber
    this.ongoingTripID = ongoingTripID
    this.archivedTripID = archivedTripID
  }

  /**
   * This function adds the tripId to a user
   * If it is successful, returns true, otherwise false
   * @param {string} tripId 
   * @return {boolean} true if the action is successful
   */
  addTripId(tripId){
    console.log("trying to add a trip to a user")
    if (this.ongoingTripID.includes(tripId))
      return false
    this.ongoingTripID.push(tripId)
    return true
  }

  /**
   * fetches all the matching carpool instance from firestore
   * @returns Promise<Carpool[]>
   */
  async getMytrip(){
    var carpoolTrips = []
    await carpoolCollection
    .withConverter(userConverter)
    .get()
    .then((doc) => {
      const carpoolId = doc.id
      const carpoolData = doc.dat()
      if (this.ongoingTripID.includes(carpoolId)){
        carpoolTrips.push(carpoolData)
      }
    })
    .catch(error => console.log(error.message))

    return carpoolTrips
    
    
  }


  /**
   * This function retrieves the first name and last name for a user
   * @returns {string, string}}
   */
  getName(){
    return {"firstName": this.firstName, "lastName": this.lastName}
  }

  /**
   * This function updates the first name and last name for a user
   * @param {string} fname 
   * @param {string} lname 
   */
  updateName(fname, lname){

  }


  /**
   * This function retrieves the gtid of a user
   * @returns {number}
   */
  getGTID(){
    return this.GTID
  }

  /**
   * This function updates the GTID for a user
   * @param {number} GTID 
   */
  updateGTID(GTID){
    this.GTID = GTID
  }



  /**
   * This function retrieves the phone number of a user
   * @returns {number}
   */
  getPhoneNumber(){
    return this.phoneNumber
  }

  /**
   * This function updatse the phone number of a user
   * @param {number} phoneNumber 
   */
  updatePhoneNumber(phoneNumber){
    this.phoneNumber = phoneNumber
  }

  /**
   * This function adds a Review for a user
   * @param {Review} review 
   */
  addReview(review){

  }

  /**
   * This function retrieves all the reviews for a user
   * @returns {List<Review>} 
   */
  getReviews(){

  }

  /**
   * This function adds a Venmo handle for the user
   * @param {string} venmo 
   */
  addVenmoHandle(venmo){

  }

  /**
   * This function retrieves the Venmo handle of a user
   * @returns {string}
   */
  getVenmoHandle(){

  }

  /**
   * This function updates a Venmo handle for the user
   * @param {string} venmo
   */
  updateVenmoHandle(venmo){

  }
}
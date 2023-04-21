import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
export const EmptyScreen = () => {
  // console.log("empty screen")
  return (
    <View
      style={{ marginTop: 30, flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text
        style={{
          color: '#40394a',
          paddingHorizontal: 10,
          fontWeight: '600',
          paddingHorizontal: 30,
          paddingVertical: 20,
          // flex: 1,
          // : 50,
          // flexDirection: "column",
          textAlign: "center",

          // flex: 0,
        }}
      >
        No Data Available
      </Text>
    </View>
  );
}

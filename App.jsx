// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import numeral from "numeral";
import uuid from "react-native-uuid";
// import jsonSorting from "json-sorting";
// import { nanoid } from "nanoid";

// data
import citiesJson from "./cities.json";
// console.log(cities.data)

export default function App() {
  const [weight, setWeight] = useState(1);
  const [city_a, setCity_a] = useState(null);
  const [city_b, setCity_b] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lat_a, setLat_a] = useState(null);
  const [lng_a, setLng_a] = useState(null);
  const [lat_b, setLat_b] = useState(null);
  const [lng_b, setLng_b] = useState(null);
  const [distance, setDistance] = useState(null);

  // let citiesData = jsonSorting(citiesJson, "city", "string")
  
  const [histories, setHistories] = useState([]);
  const [cities, setCities] = useState(citiesJson);

  const dropdownRef_a = useRef({});
  const dropdownRef_b = useRef({});

  // measure distance
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  function getDistance(lat1, lng1, lat2, lng2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLng = deg2rad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = Math.round(R * c * 10) / 10; // Distance in km
    return d;
  }

  // reset form paket
  function reset() {
    setWeight(1);
    setDetail("");
    setCity_a(null);
    setCity_b(null);
    dropdownRef_a.current.reset();
    dropdownRef_b.current.reset();
    setDistance(null);
  }

  // API REQUEST ->

  // async function submitForm() {
  //   if (city_a && city_b && detail) {
  //     setLoading(true);
  //     const data = {
  //       weight: weight,
  //       city_a: city_a,
  //       city_b: city_b,
  //       detail: detail,
  //     };
  //     fetch("http://localhost:8000/api/histori", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     getHistories();
  //     reset();
  //     setLoading(false);
  //   }
  // }
  // async function getHistories() {
  //   return fetch("http://localhost:8000/api/histori")
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       // console.log("data : ", responseJson.data);
  //       setHistories(responseJson.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
  // async function getCities() {
  //   return fetch("http://localhost:8000/api/cities")
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       // console.log("data : ", responseJson.data);
  //       setCities(responseJson.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
  //
  // useEffect(() => {
  //   getCities();
  //   getHistories();
  // }, []);

  // Local Storage Setup ->

  async function historyInit() {
    var prevHistories = await AsyncStorage.getItem("@histories");
    if (prevHistories) {
      prevHistories = JSON.parse(prevHistories);
      setHistories(prevHistories);
    } else {
      await AsyncStorage.setItem("@histories", JSON.stringify([]));
      setHistories([]);
    }
  }
  useEffect(() => {
    historyInit();
  }, []);

  async function submitFormLocal() {
    if (city_a && city_b && detail) {
      setLoading(true);
      const data = {
        _id: uuid.v4(),
        city_a: city_a,
        city_b: city_b,
        detail: detail,
        weight: weight,
        distance: distance,
        ongkir: weight * distance * 100,
      };
      let newHistories = histories;
      newHistories.push(data);

      newHistories = JSON.stringify(newHistories);
      console.log(newHistories);
      await AsyncStorage.setItem("@histories", newHistories);
      console.log(await AsyncStorage.getItem("@histories"));

      reset();
      historyInit();
      setLoading(false);
    }
  }

  // debuger
  async function getAllLocalData() {
    AsyncStorage.clear();
  }
  async function logger() {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.log("All :");
    console.log(result);
    console.log("histories state :");
    console.log(histories);
    // historyInit()
  }

  // check distance when value changes
  useEffect(() => {
    if (city_a && city_b) {
      setDistance(getDistance(lat_a, lng_a, lat_b, lng_b));
      // console.log(getDistance(lat_a, lng_a, lat_b, lng_b));
    }
  }, [city_a, city_b]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainView}>

        {/* <Pressable onPress={logger} style={styles.buttonRefresh} title="Submit">
          <Text
            style={{
              color: "#777",
              fontWeight: "bold",
              fontSize: 28,
            }}
          >
            Log
          </Text>
        </Pressable>
        <Pressable
          onPress={getAllLocalData}
          style={styles.buttonRefresh}
          title="Submit"
        >
          <Text
            style={{
              color: "#777",
              fontWeight: "bold",
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            ???
          </Text>
        </Pressable> */}

        {/* <Text style={styles.text}>Hello World!</Text> */}
        <Text style={styles.text}>Kirim Paket ????</Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.textList, { color: "#555" }]}>
            Berat Barang (Kg)
          </Text>
          <TextInput
            style={[styles.input]}
            onChangeText={setWeight}
            value={weight}
            keyboardType="numeric"
          />

          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{}}>
              <Text style={[styles.textList, { color: "#555" }]}>
                Kota Pengirim
              </Text>
              <SelectDropdown
                search
                defaultButtonText="- - - select - - -"
                ref={dropdownRef_a}
                buttonStyle={{
                  width: 185,
                  backgroundColor: "#FFF",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#777",
                  marginLeft: 8,
                }}
                buttonTextStyle={{
                  color: "#666",
                }}
                data={cities}
                onSelect={(selectedItem, index) => {
                  setCity_a(selectedItem);
                  setLat_a(selectedItem.lat);
                  setLng_a(selectedItem.lng);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.city;
                }}
                rowTextForSelection={(item, index) => {
                  return item.city;
                }}
              />
            </View>
            <View style={{ width: "40%" }}>
              <Text style={[styles.textList, { color: "#555" }]}>
                Kota Penerima
              </Text>
              <SelectDropdown
                search
                defaultButtonText="- - - select - - -"
                ref={dropdownRef_b}
                buttonStyle={{
                  width: 185,
                  flex: 1,
                  backgroundColor: "#FFF",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#777",
                }}
                buttonTextStyle={{
                  color: "#666",
                }}
                data={cities}
                onSelect={(selectedItem, index) => {
                  setCity_b(selectedItem);
                  setLat_b(selectedItem.lat);
                  setLng_b(selectedItem.lng);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.city;
                }}
                rowTextForSelection={(item, index) => {
                  return item.city;
                }}
              />
            </View>
          </View>
          {distance && (
            <Text
              style={{
                marginTop: 8,
                color: "blue",
                fontWeight: "700",
                fontSize: 16,
              }}
            >{`?????? Jarak ${distance}Km | Berat ${weight}Kg | Ongkir Rp ${numeral(
              distance * weight * 100
            ).format("0,0")}`}</Text>
          )}

          <Text style={[styles.textList, { color: "#555", marginTop: 16 }]}>
            Detail Alamat Penerima
          </Text>
          <TextInput
            style={[styles.input, { height: 72 }]}
            onChangeText={setDetail}
            multiline={true}
            value={detail}
          />
          {loading ? (
            <Text style={{ fontSize: 18, marginVertical: 16 }}>
              Sending Data . . .{" "}
            </Text>
          ) : (
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 0 }}
            >
              <Pressable
                onPress={reset}
                style={styles.buttonReset}
                title="Submit"
              >
                <Text
                  style={{ color: "#666", fontWeight: "bold", fontSize: 16 }}
                >
                  Reset
                </Text>
              </Pressable>
              <Pressable
                onPress={submitFormLocal}
                style={styles.button}
                title="Kirim"
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Kirim
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 32,
            marginBottom: 16,
          }}
        >
          <Text style={styles.text}>History ????</Text>
          <Pressable
            onPress={historyInit}
            style={styles.buttonRefresh}
            title="Submit"
          >
            <Text
              style={{
                color: "#777",
                fontWeight: "bold",
                fontSize: 28,
                marginBottom: 12,
              }}
            >
              ???
            </Text>
          </Pressable>
        </View>

        {histories?.length > 0 &&
          histories.map((history) => {
            return (
              <View
                key={history._id}
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 16,
                  marginBottom: 4,
                  borderRadius: 8,
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View>
                    <Text
                      style={{ fontSize: 18, width: 300 }}
                    >{`${history.city_a.city} - ${history.city_b.city}`}</Text>
                    <Text
                      style={{ fontSize: 10, width: 300, color: "#666" }}
                    >{`ID #${history._id}`}</Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginLeft: "auto",
                      fontSize: 18,
                    }}
                  >{`Rp.${numeral(history.ongkir).format("0,0")}`}</Text>
                </View>

                <Text
                  style={{ marginTop: 16, color: "#777" }}
                >{`Detail: Jarak ${history.distance}Km | Berat ${history.weight}Kg`}</Text>
                {/* <Text
                  style={{ marginTop: 0, color: "#777" }}
                >{`Driver: ${history.driver.name}`}</Text> */}
                <Text
                  style={{
                    marginTop: 0,
                    color: "tomato",
                    textAlign: "justify",
                  }}
                >{`Alamat: ${history.detail}`}</Text>

                
              </View>
            );
          })}
      </View>

      {/* <StatusBar style="auto" /> */}
      <View
        style={{
          backgroundColor: "tomato",
          marginTop: 32,
          width: "100%",
          height: 64,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          First React Native App ????? Muhammad Advie Rifaldy 2022 ????
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: "tomato",
    marginRight: 8,
    marginTop: 8,
    width: 185,
  },
  buttonReset: {
    alignItems: "center",
    justifyContent: "center",
    width: 185,
    height: 52,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: "#f4f4f4",
    marginRight: 8,
    marginTop: 8,
  },
  buttonRefresh: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  container: {
    marginTop: 32,
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 52,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    borderRadius: 8,
  },
  // selectBtn: {
  //   flex: 1,
  //   height: 50,
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: "#444",
  // },
  mainView: {
    // margin: 8,
    marginHorizontal: 16,
    marginTop: 32,
  },
  text: {
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "bold",
  },
  textList: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: "400",
    color: "#666",
  },
});

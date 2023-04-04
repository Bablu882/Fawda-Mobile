import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import service from "../service";
import { selectToken, selectUserType } from "../slices/authSlice";
import moment from "moment";

const CustomComponent = ({ label, value }) => {
  return (
    <View
      style={[
        styles.inputView,
        styles.inputbox,
        {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 10,
        },
      ]}
    >
      <TextInput
        style={[styles.TextInput, { width: "100%" }]}
        placeholder={label}
        placeholderTextColor={"#000"}
      />
      <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>{value}</Text>
    </View>
  );
};

function Theke_MachineForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { id, item } = route?.params ?? {};
  const [ratingList, setRatingList] = useState([]);
  console.log("rating", item?.rating);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({ status: "pending" });

  const [amount, setAmount] = useState({});
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);

  const textInputRef = useRef(null);
  const handleClick = () => {
    textInputRef.current.focus();
  };

  console.log("fnfjff", item, item.booking_id);
  const accptThekha = async () => {
    let params = {
      job_id: item?.id,
    };
    console.log("jjff", params);
    try {
      const response = await service.post("/api/accept_theka/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      console.log("aaaa", data);
      setThekeperKam(data?.data);
      console.log("rrrr", thekeperKam);
      navigation.replace("MyBooking");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleClicks = (index) => {
    setRating(index + 1);
    const newColors = [...colors];
    if (index < 4) newColors[index] = "red";
    else if (index >= 4 && index < 9) newColors[index] = "yellow";
    else if (index >= 9) newColors[index] = "green";
    setColors(newColors);
    RatingApi();
  };

  const Edit = async () => {
    let params =
      // {
      // job_id:"95",
      // amount:"2221"
      // }
      {
        job_id: item?.id,
        amount: amount,
      };
    console.log(params, "params");

    try {
      const response = await service.post("/api/edit_thekepekam/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      // setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  //   const RatingApi = async () => {
  //     let params = {
  //       booking_job: item?.booking_id,

  //     };

  // console.log('paramsparams', params)
  //     try {
  //       const response = await service.post("/api/get-reating/", params, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token?.access}`,
  //         },
  //       });
  //       const data = response?.data;
  //       // setThekeperKam(data.data);
  //       console.log("fjfjf", data);
  //     } catch (error) {
  //       console.log("Error:", error);
  //     }
  //   };
  const RatingApi = async () => {
    let params = {
      booking_job: item?.booking_id,
    };

    try {
      const response = await service.post("/api/get-reating/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      const ratings = data?.rating;
      const ratingColor = 'orange';

      const ratingList = Array(10)
      .fill(0)
      .map((_, num) => {
        let color = num < ratings ? ratingColor : "white";
        return (
          <View
            key={num}
            style={{
              backgroundColor: color,
              borderWidth: 1,
              borderColor: "#ccc",
              width: 30,
              height: 30,
              borderRightWidth: 0.1,
              borderEndWidth: 0.4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {num + 1 <= ratings && (
              <FontAwesome name="star" size={18} color="white" />
            )}
            {num + 1 > ratings && (
              <FontAwesome name="star-o" size={18} color={ratingColor} />
            )}
          </View>
        );
      });
    
      setRatingList(ratingList);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // const RatingApi = async () => {
  //   let params = {
  //     booking_job: item?.booking_id,
  //   };
  
  //   try {
  //     const response = await service.post("/api/get-reating/", params, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token?.access}`,
  //       },
  //     });
  //     const data = response?.data;
  //     const ratings = data?.rating;
  //     const ratingColor = "orange";
  //     const ratingList = Array(10)
  //     .fill(0)
  //     .map((_, num) => {
  //       let color = num < ratings ? ratingColor : "white";
  //       return (
  //         <View
  //           key={num}
  //           style={{
  //             backgroundColor: "white",
  //             borderWidth: 1,
  //             borderColor: "#ccc",
  //             width: 30,
  //             height: 30,
  //             borderRightWidth: 0.1,
  //             borderEndWidth: 0.4,
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //         >
  //           {num < ratings ? (
  //             <FontAwesome name="star" size={18} color={ratingColor} />
  //           ) : (
  //             <FontAwesome name="star-o" size={18} color={color} />
  //           )}
  //         </View>
  //       );
  //     });
  //     setRatingList(ratingList);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };
  useEffect(() => {
    RatingApi();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View
          style={{
            //alignItems: "center",
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
            {item?.job_type === "theke_pe_kam" ? "ठेके पर काम" : "ठेके पर काम"}
          </Text>
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
              {
                height: 90,
              },
            ]}
          >
            <Text style={styles.label}>काम का विवरण</Text>
            <Text style={[styles.TextInput]}>{item.description}</Text>
            <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            />
          </View>
          {usertype &&
            (usertype === "Sahayak" || usertype === "MachineMalik") && (
              <View style={[styles.inputView, { height: 40 }]}>
                <Text style={styles.label}>गाँव</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#848484"
                  placeholder={item?.village}
                />
              </View>
            )}
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.TextInput}>
              {moment.utc(item?.datetime).format("l")}
            </Text>
            <Text style={styles.TextInput}>
              {moment.utc(item?.datetime).format("LT")}
            </Text>
          </View>
          {usertype &&
            (usertype === "Sahayak" || usertype === "MachineMalik") && (
              <View
                style={[
                  styles.inputView,
                  styles.inputbox,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>भूमि क्षेत्र</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#848484"
                  placeholder=""
                />
                <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
                  {item?.land_area}
                  {item?.land_type}
                </Text>
              </View>
            )}
          <View></View>
          {/* {usertype === "Grahak" && (
           
          )} */}
          {usertype && usertype === "Grahak" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={[
                    styles.BhumiView,
                    styles.inputbox,
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "40%",
                    },
                  ]}
                >
                  <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#000"
                    placeholder="भूमि क्षेत्र "
                  />
                  <Text style={{ right: 10, color: "#0070C0" }}>
                    {item?.land_area}
                    {item?.land_type}
                  </Text>
                </View>
                <View
                  style={[
                    styles.BhumiView,
                    styles.flex,
                    styles.justifyContentBetween,
                    { width: "40%" },
                  ]}
                >
                  <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#000"
                    placeholder="वेतन"
                  />
                  <TextInput
                    editable={edit}
                    ref={textInputRef}
                    onChangeText={(amount) => setAmount(amount)}
                    value={amount}
                    style={{ paddingRight: 10 }}
                    defaultValue={item?.total_amount_theka}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.flex,
                  { marginTop: 10, justifyContent: "space-between" },
                ]}
              >
                <View style={{ width: "60%" }}></View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleClick();
                      setEdit(true);
                      console.log("edit:::::", edit);
                    }}
                    style={{
                      backgroundColor: "#0099FF",
                      marginRight: 10,
                      padding: 5,
                    }}
                  >
                    <Text style={[styles.TextWhite, { fontSize: 12 }]}>
                      वेतन बदलें
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Edit()}
                    style={{
                      backgroundColor: "#44A347",
                      paddingHorizontal: 10,
                      paddingTop: 4,
                    }}
                  >
                    <Text style={[styles.TextWhite, { fontSize: 12 }]}>
                      कन्फर्म
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                ]}
              >
                <TextInput
                  style={styles.TextInput}
                  placeholder="काम की स्थिति"
                  placeholderTextColor={"#000"}
                />
                <View
                  style={{
                    width: "30%",
                    height: 30,
                    backgroundColor: "#44A347",
                    marginRight: 10,
                    marginTop: 8,
                  }}
                >
                  {/* {console.log("thekeperKam?.status", thekeperKam?.status)} */}

                  <TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 5,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {item?.status}
                    </Text>
                    {/* {thekeperKam && (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 5,
                          color: "#fff",
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {thekeperKam?.status}
                      </Text>
                    )} */}
                  </TouchableOpacity>
                </View>
              </View>
              {item.status === "Accepted" && (
                <TouchableOpacity
                  style={styles.BhuktanBtn}
                  onPress={() =>
                    navigation.navigate("Payment", {
                      item,
                    })
                  }
                >
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    भुगतान करें
                  </Text>
                </TouchableOpacity>
              )}
              {item.status === "Pending" && (
                <TouchableOpacity style={styles.BhuktanBtn}>
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    भुगतान करें
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <>
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <>
                    <CustomComponent
                      label="किसान से वेतन"
                      value={item?.total_amount_theka}
                    />
                    <CustomComponent
                      label="फावड़ा की फीस"
                      value={item?.fawda_fee}
                    />
                    <CustomComponent
                      label="आपका भुगतान"
                      value={item?.payment_your}
                    />
                  </>
                )}
            </>
          </View>
          {usertype === "Sahayak" || usertype === "MachineMalik" ? (
            <>
              {item.status === "Accepted" && (
                <TouchableOpacity style={styles.BhuktanBtn}>
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    काम स्वीकृत
                  </Text>
                </TouchableOpacity>
              )}
              {item.status === "Pending" && (
                <TouchableOpacity
                  style={styles.BhuktanBtn}
                  onPress={() => accptThekha()}
                >
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    काम स्वीकार करें
                  </Text>
                </TouchableOpacity>
              )}
              {item.status === "Booked" && (
                <TouchableOpacity style={styles.BhuktanBtn}>
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    काम बुक
                  </Text>
                </TouchableOpacity>
              )}
              {item.status === "Ongoing" && (
                <TouchableOpacity style={styles.BhuktanBtn}>
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    जारी है
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : null}

          {usertype === "Sahayak" ||
            (usertype === "MachineMalik" && item.status === "Completed" && (
              <TouchableOpacity style={styles.BhuktanBtn}>
                <Text style={[styles.loginText, { color: "#fff" }]}>
                  जारी हैff
                </Text>
              </TouchableOpacity>
            ))}

          {(usertype === "Sahayak" || usertype === "MachineMalik") &&
          (item.status === "Accepted" ||
            item.status === "Booked" ||
            item.status === "Ongoing") ? (
            <>
              <View style={[styles.inputView, { height: 40 }]}>
                <Text style={styles.label}>ग्राहक का नाम</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#848484"
                  placeholder={item?.grahak_name}
                />
              </View>

              <View style={[styles.inputView, { height: 40 }]}>
                <Text style={styles.label}>फ़ोन:</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#848484"
                  placeholder={item?.grahak_phone}
                />
              </View>
            </>
          ) : null}
        </View>

        <>
          {item.status === "Completed" && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={[styles.BhuktanBtn,{width:'95%', marginBottom:10}]}>
                <Text style={[styles.loginText, { color: "#fff" }]}>
                समाप्त 
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {ratingList}
              </View>
            </View>
          )}

          {/* <View
            style={{ height: 100, borderWidth: 1, width: "75%", marginTop: 20 }}
          >
            <TextInput
              placeholder="comment"
              onChangeText={data?.comment}
              value={data?.comment}
            />
          </View>  */}
        </>

        <View style={{ marginTop: "auto", padding: 5 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: "#D9D9D9",
              alignSelf: "center",
              paddingHorizontal: 50,
              paddingVertical: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              रद्द करें
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default Theke_MachineForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    backgroundColor: "#fff",
  },
  OptionButton: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //   margin:20,
    //   padding:20
  },

  sahayak: {
    width: "40%",
    // flexDirection:"column",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
    // backgroundColor: "#44A347",
  },

  machine: {
    width: "40%",
    flexDirection: "row",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    // borderWidth:1,
    borderRadius: 10,
    // borderColor:"#505050"
    backgroundColor: "#44A347",
  },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
  },

  BhuktanBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },

  VerifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    padding: 10,

    fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "40%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "50%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "42%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "40%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  justifyContentevenly: {
    justifyContent: "space-evenly",
  },
  TextWhite: {
    color: "#fff",
  },
  salaryAmount: {
    marginTop: 13,
    marginRight: 8,
    color: "#0099FF",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,
    marginHorizontal: 5,

    textAlign: "center",
    backgroundColor: "#fff",
  },
});

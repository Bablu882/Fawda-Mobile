import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  Button,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-simple-toast";

import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import CustomComponent from "../Component/CustomComponent";

export default function MyBook_SahayakForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [ratingList, setRatingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id, item, fawdafee, bookingid } = route.params;
  // console.log("ghghghg", item);
  const itemStatus = item?.status;
  const [jobId, setJobId] = useState(route?.params?.id);
  const [show, setShow] = useState(true);
  const [checkboxStatus, setCheckboxStatus] = useState({});
  const [maleStatuses, setMaleStatuses] = useState({});
  const [totalMaleAccepted, setTotalMaleAccepted] = useState(0);
  const [showFirstView, setShowFirstView] = useState(true);
  const [showSecondView, setShowSecondView] = useState(false);
  const [thekeperKams, setThekeperKams] = useState([]);
  const [thekeparpending, setThekeperKamPending] = useState([]);
  const [thekeperKam, setThekeperKam] = useState([]);
  const [totalFemaleAccepted, setTotalFemaleAccepted] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(null);
  const [maleCount, setMaleCount] = useState(null);
  const usertype = useSelector(selectUserType);
  const [edit, setEdit] = useState(false);
  const [editmale, setEditMale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [amountMale, setAmountMale] = useState(item?.pay_amount_male || 0);
  const [amountFemale, setAmountFemale] = useState(
    item?.pay_amount_female || 0
  );
  const [jobsData, setJobsData] = useState([]);
  const [countAcceptedJobs, setCountAcceptedJobs] = useState();
  const [acceptedStatus, setAcceptedStatus] = useState();
  const [pendingmale, setPendingMale] = useState();
  const [pendingfemales, setPendingFemale] = useState();
  const [acceptmale, setAcceptMale] = useState();
  const [acceptfemale, setAcceptFemale] = useState();
  const [countprice, setCountPrice] = useState();
  const [fawdafees, setFawdafees] = useState();
  const [totalamount, setTotalAmount] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState("");
  const [statusAccept, setStatusAccept] = useState("");
  const [statusPending, setStatusPending] = useState("");
  const textInputRef = useRef(null);
  const [numBookings, setNumBookings] = useState(0);
  const handleClick = () => {
    setEdit(true);
    setEditMale(true);
    textInputRef.current.focus();
  };

  const acceptSahayak = async () => {
    setIsLoading(true);
    let params = {
      count_male: totalMaleAccepted,
      count_female: totalFemaleAccepted,
      job_id: JSON.stringify(id),
    };
    try {
      const response = await service.post("/api/accept_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      Toast.show("काम स्वीकार किया गया है!", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobData = async () => {
    setIsLoading(true);
    try {
      const response = await service.get(`/api/nearjob/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.results;
      // console.log("dayaaaaaa", data);
      setJobsData(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (usertype && usertype !== "Grahak") {
      jobsData.forEach((jobData, index) => {
        if (id === jobData.id) {
          setAmountMale(jobData.pay_amount_male);
          setAmountFemale(jobData.pay_amount_female);
        }
      });
    }
  }, [jobsData]);

  const checkPayment = async () => {
    setIsLoading(true);
    try {
      const response = await service.get(`/api/nearjob/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.results;
      console.log("dayaaaaaa", data);

      if (usertype && usertype !== "Grahak") {
        const matchingJobData = data.find((jobData) => jobData.id === item?.id);
        console.log("matchingJobData:", matchingJobData);

        if (matchingJobData) {
          const totalAmountMale = matchingJobData.pay_amount_male;
          const totalAmountFemale = matchingJobData.pay_amount_female;
          const male = matchingJobData.count_male;
          const female = matchingJobData.count_female;

          if (
            amountMale !== totalAmountMale ||
            amountFemale !== totalAmountFemale
          ) {
            Toast.show(
              "इस कार्य के लिए भुगतान बदल दिया गया है! कृपया स्क्रीन को रिफ़्रेश करें!",
              Toast.LONG
            );
          } else if (
            male !== item?.count_male ||
            female !== item?.count_female
          ) {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show(
              "नौकरी के लिए आवश्यकताएँ बदल दी गई हैं! कृपया नौकारी पुनः लोड करें",
              Toast.LONG
            );
          } else {
            console.log("Payment OK");
            acceptSahayak();
          }
        } else {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show("यह नौकरी ग्राहक द्वारा रद्द कर दी गई है", Toast.LONG);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    setIsLoading(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;

      if (usertype && usertype === "Grahak") {
        if (response?.data?.sahayk_booking_details?.bookings.length > 0) {
          const bookingsNumber =
            response?.data?.sahayk_booking_details?.bookings.length;

          if (numBookings > bookingsNumber) {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show(
              "यह बुकिंग सहायक द्वारा रद्द कर दी गई है।कृपया बुकिंग पुनः लोड करें!",
              Toast.LONG
            );
          } else if (numBookings < bookingsNumber) {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show(
              "यह बुकिंग एक अन्य सहायक द्वारा स्वीकार की गई है। कृपया बुकिंग पुनः लोड करें!",
              Toast.LONG
            );
          } else if (numBookings === bookingsNumber) {
            navigation.replace("Payment", {
              item,
              fawdafee: fawdafees,
              countprice,
              acceptfemale,
              acceptmale,
              totalamount,
              id: jobId,
              bookings: numBookings,
            });
          }
        } else {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show(
            "यह बुकिंग सहायक द्वारा रद्द कर दी गई है।कृपया नौकारी पुनः लोड करें!",
            Toast.LONG
          );
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Edit = async () => {
    // setIsLoading(true);
    // setRefreshing(true);
    let updatedMaleAmount;
    if (amountMale !== 0) {
      updatedMaleAmount = amountMale;
    } else {
      updatedMaleAmount = item?.pay_amount_male;
    }

    let updatedFemaleAmount;
    if (amountFemale !== 0) {
      updatedFemaleAmount = amountFemale;
    } else {
      updatedFemaleAmount = item?.pay_amount_female;
    }

    let params = {
      job_id: JSON.stringify(id),
      pay_amount_male: updatedMaleAmount,
      pay_amount_female: updatedFemaleAmount,
    };
    try {
      const response = await service.post("/api/edit_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      console.log("testestest", data);

      if (data.status === 200) {
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
        Toast.show("वेतन सफलतापूर्वक अपडेट किया गया है!", Toast.LONG);
      } else {
        Toast.show("राशि अपडेट नहीं की गई है।", Toast.LONG);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const checkSahayakStatus = async () => {
    setIsLoading(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;

      if (usertype && usertype === "Grahak") {
        const statusCheck =
          data?.sahayk_booking_details?.bookings[0]?.status || "";
        if (statusCheck === "Accepted") {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show("यह बुकिंग सहायक द्वारा स्वीकार कर ली गई है।", Toast.LONG);
        } else {
          Edit();
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const toggleViews = () => {
    setShowFirstView(!showFirstView);
    setShowSecondView(!showSecondView);
  };

  const handleCheckboxChange = (index) => {
    const updatedStatus = { ...checkboxStatus };
    updatedStatus[index] =
      updatedStatus[index] === "Accepted" ? "Pending" : "Accepted";
    setCheckboxStatus(updatedStatus);
    setIsButtonDisabled(false);
    // Call countAccepted function to update count
    const acceptedCount = countAccepted();
    setAcceptedCount(acceptedCount);
  };

  const countAccepted = () => {
    let count = 0;
    Object.values(checkboxStatus).forEach((value) => {
      if (value === "Accepted") {
        count++;
      }
    });
    return count;
  };

  const handleAcceptMale = (index) => {
    const updatedMaleStatuses = { ...maleStatuses };
    updatedMaleStatuses[index] =
      updatedMaleStatuses[index] === "Accepted" ? "Pending" : "Accepted";
    setMaleStatuses(updatedMaleStatuses);
    setIsButtonDisabled(false);
    // Call malecount function to update count
    const maleCount = malecount();
    setMaleCount(maleCount);
  };

  const malecount = () => {
    let count = 0;
    Object.values(maleStatuses).forEach((value) => {
      if (value === "Accepted") {
        count++;
      }
    });
    return count;
  };

  function handleFemaleAccepted() {
    const totalfemale = countAccepted();
    setTotalFemaleAccepted(totalfemale);
    // console.log("totalFemaleAcceptedtotalFemaleAccepted", totalFemaleAccepted);
  }

  useEffect(() => {
    const totalAccepted = malecount();
    setTotalMaleAccepted(totalAccepted);
  }, [malecount]);

  useEffect(() => {
    const totalfemale = countAccepted();
    setTotalFemaleAccepted(totalfemale);
  }, [countAccepted]);

  const TotalCount = parseInt(item.count_female) + parseInt(item.count_male);

  const RatingApi = async () => {
    setIsLoading(true);
    let params = {
      booking_job: item?.booking_id,
    };

    try {
      const response = await service.post("/api/get-rating/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      const ratings = data?.data?.rating;
      const ratingColor = "#e6b400";

      const ratingList = Array(5)
        .fill(0)
        .map((_, num) => {
          let color = num < ratings ? ratingColor : "white";
          return (
            <View
              key={num}
              style={{
                // borderColor: color,
                // borderWidth: 1,
                width: 30,
                height: 30,
                // borderRightWidth: 0.1,
                // borderEndWidth: 0.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {num + 1 <= ratings && (
                <FontAwesome name="star" size={24} color="#e6b400" />
              )}
              {num + 1 > ratings && (
                <FontAwesome name="star-o" size={24} color={ratingColor} />
              )}
            </View>
          );
        });

      setRatingList(ratingList);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // Hide loader after fetching data
    }
  };

  const cancel = async () => {
    setIsLoading(true);
    let params = {
      job_id: JSON.stringify(id),
      job_number: item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled",
    };

    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      // setStatus(data.status);
      navigation.replace("HomeStack", { screen: "BottomTab" });
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const Rejected = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      status: "Rejected",
    };
    // console.log('Rejected', params)

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      navigation.replace("HomeStack", { screen: "BottomTab" });
      // console.log(data, "sds");
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const myStatusBooked = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item.booking_id),
    };
    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-myjobs/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      if (data[0]?.status === "Booked") {
        Toast.show(
          "यह बुकिंग ग्राहक द्वारा बुक की गई है। कृपया रिफ़्रेश करें!",
          Toast.LONG
        );
      } else {
        Rejected();
      }
      console.log("status", status);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const RejectedPayment = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      status: "Rejected-After-Payment",
    };
    // console.log('Rejected', params)

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      navigation.replace("HomeStack", { screen: "BottomTab" });
      // console.log(data, "sds");
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getStatusButton(status, label) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: status === "Pending" ? "#44A347" : "#0099FF",
          width: "100%",
          borderRadius: 7,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",

            color: "#fff",
            fontSize: 10,
            fontWeight: "600",
            fontFamily: "Devanagari-bold",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  const mybookingdetail = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };
    console.log("fjfjfjfjff", params);
    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      console.log("Accepted Items", response?.data?.sahayk_booking_details);

      if (response?.data?.sahayk_booking_details?.bookings.length > 0) {
        setNumBookings(response?.data?.sahayk_booking_details?.bookings.length);
        const acceptedJobs =
          response?.data?.sahayk_booking_details?.bookings.map(
            (job) => parseInt(job.count_female) + parseInt(job.count_male)
          );

        const acceptedMale =
          response?.data?.sahayk_booking_details?.bookings.map((job) =>
            parseInt(job.count_male)
          );
        const acceptedFemale =
          response?.data?.sahayk_booking_details?.bookings.map((job) =>
            parseInt(job.count_female)
          );

        const totalacceptedcount = acceptedJobs?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        const totalmalecount = acceptedMale?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        const totalfemalecount = acceptedFemale?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        // console.log("Total accepted jobs: ", totalmalecount,totalfemalecount);
        setCountAcceptedJobs(totalacceptedcount);
        setAcceptMale(totalmalecount);
        setAcceptFemale(totalfemalecount);
        const countprice = response?.data?.sahayk_booking_details?.bookings.map(
          (item) => Number(item?.total_amount_sahayak)
        );
        const fawdafees = response?.data?.sahayk_booking_details?.bookings.map(
          (item) => Number(item?.fawda_fee)
        );
        const totalamounts =
          response?.data?.sahayk_booking_details?.bookings.map((item) =>
            Number(item?.total_amount)
          );

        const Totalprice = countprice.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        console.log(Totalprice);
        // const TotalAmount = totalamounts.reduce(
        //   (accumulator, currentValue) => accumulator + currentValue,
        //   0
        // );
        const totalfawdafees = fawdafees.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        const TotalAmount = Totalprice + totalfawdafees;
        console.log(totalfawdafees)
        setFawdafees(totalfawdafees);
        setTotalAmount(TotalAmount);
        setCountPrice(Totalprice);

        const acceptedStatusLength =
          response?.data?.sahayk_booking_details?.bookings.filter(
            (job) => job.status === "Accepted"
          );
        // console.log("Accepted status length: ", acceptedStatusLength.length);
        setAcceptedStatus(acceptedStatusLength.length);
      }

      const pendingMale = response?.data?.sahayak_pending_booking_details?.map(
        (job) => Number(job?.count_male)
      );
      const pendingFemale =
        response?.data?.sahayak_pending_booking_details?.map((job) =>
          Number(job?.count_female)
        );
      setPendingFemale(pendingFemale);
      setPendingMale(pendingMale);
      setThekeperKamPending(data?.sahayak_pending_booking_details);
      setThekeperKams(data?.sahayk_booking_details?.bookings);
      if (usertype && usertype === "Grahak") {
        const acceptData = data?.sahayk_booking_details?.bookings[0] || "";
        if (acceptData && acceptData !== "") {
          setStatusAccept(
            data?.sahayk_booking_details?.bookings[0]?.status || ""
          );
          setStatusPending("");
        } else {
          setStatusPending(
            data?.sahayak_pending_booking_details[0]?.status || ""
          );
        }
      }
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const myjobs = async () => {
    setIsLoading(true);
    setRefreshing(true);
    let params = {
      booking_id: JSON.stringify(item.booking_id),
    };
    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-myjobs/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      console.log("daattata", data);
      setStatus(data[0]?.status);
      if (
        data[0]?.status === "Cancelled" ||
        data[0]?.status === "Cancelled-After-Payment"
      ) {
        navigation.replace("HomeStack", { screen: "BottomTab" });
        Toast.show("यह नौकरी ग्राहक द्वारा रद्द कर दी गई है!", Toast.LONG);
      }
      console.log("status", status);
      setThekeperKam(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    mybookingdetail();
    myjobs();
    RatingApi();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    myjobs().then(() => {
      setRefreshing(false);
    });
    RatingApi().then(() => {
      setRefreshing(false);
    });
    mybookingdetail().then(() => {
      setRefreshing(false);
    });
    fetchJobData().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View>
        {/* {isLoading && <ActivityIndicator size="small" color="#black" />} */}
      </View>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "600",
            fontFamily: "Devanagari-bold",
          }}
        >
          {item?.job_type === "individuals_sahayak" && "सहायक का काम "}
        </Text>
      </View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      {!isLoading && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginHorizontal: 10,
              fontFamily: "Devanagari-regular",
            }}
          >
            <View
              style={[
                styles.inputView,
                styles.flex,
                styles.justifyContentBetween,
                { height: 80 },
              ]}
            >
              <Text style={styles.label}>काम का विवरण</Text>
              <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                {item?.description}
              </Text>
              <Image
                source={require("../assets/image/edit.png")}
                style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
              />
            </View>
            {usertype &&
              (usertype === "Sahayak" || usertype === "MachineMalik") && (
                <View style={[styles.inputView, { height: 40 }]}>
                  <Text style={styles.label}>गाँव</Text>
                  <Text style={[styles.TextInput]}>
                    {item?.status == "Completed"
                      ? item?.grahak_village
                      : item?.village}
                  </Text>
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
                {moment(item?.datetime).format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.TextInput}>
                {moment(item?.datetime).format("LT")}
              </Text>
            </View>

            <View
              style={[
                styles.inputView,
                styles.inputbox,
                { position: "relative" },
              ]}
            >
              <Text style={styles.label}>भूमि क्षेत्र</Text>
              <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                editable={false}
                placeholder=""
              />
              <Text
                style={{
                  top: 10,
                  right: 5,
                  position: "absolute",
                  color: "#0099FF",
                }}
              >
                {item?.land_area}
                {item?.land_type == "Bigha"
                  ? " बीघा"
                  : item?.land_type == "Killa"
                  ? " किल्ला"
                  : " "}
              </Text>
            </View>

            <View style={[styles.flex, styles.justifyContentBetween]}>
              <View
                style={[
                  styles.TaxView,
                  styles.flex,
                  styles.justifyContentBetween,
                  { marginRight: 5 },
                ]}
              >
                {usertype === "Grahak" ? (
                  <>
                    <TextInput
                      style={[styles.TextInput]}
                      placeholder="एक पुरुष का वेतन"
                      editable={false}
                      placeholderTextColor={"#000"}
                    />
                    <TextInput
                      editable={editmale}
                      keyboardType="numeric"
                      ref={textInputRef}
                      onChangeText={(amountMale) => setAmountMale(amountMale)}
                      value={amountMale}
                      style={{ paddingRight: 10, color: "#0099FF" }}
                      defaultValue={item?.pay_amount_male}
                    />
                  </>
                ) : (
                  <>
                    <Text style={[styles.TextInput]}>एक पुरुष का वेतन</Text>
                    <Text style={{ marginRight: 8, color: "#0099FF" }}>
                      ₹ {amountMale}
                    </Text>
                  </>
                )}
              </View>
              <View
                style={[
                  styles.TaxView,
                  styles.flex,
                  styles.justifyContentBetween,
                  { marginRight: 5 },
                ]}
              >
                {usertype === "Grahak" ? (
                  <>
                    <TextInput
                      style={styles.TextInput}
                      placeholder="एक महिला का वेतन"
                      editable={false}
                      placeholderTextColor={"#000"}
                    />
                    <TextInput
                      editable={edit}
                      keyboardType="numeric"
                      ref={textInputRef}
                      onChangeText={(amountFemale) =>
                        setAmountFemale(amountFemale)
                      }
                      value={amountFemale}
                      style={{ paddingRight: 10, color: "#0099FF" }}
                      defaultValue={item?.pay_amount_female}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.TextInput}>एक महिला का वेतन</Text>
                    <Text style={{ marginRight: 10, color: "#0099FF" }}>
                      ₹ {amountFemale}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: "70%" }}></View>
              <View>
                {usertype &&
                  usertype === "Grahak" &&
                  item?.status === "Pending" &&
                  statusAccept !== "Accepted" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      {acceptedStatus != 1 && (
                        <View>
                          <View key={item.id}>
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  handleClick();
                                  setEdit(true);
                                  setEditMale(true);
                                  // console.log("edit:::::", edit);
                                }}
                                style={{
                                  backgroundColor: "#0099FF",
                                  marginRight: 10,
                                  padding: 5,
                                }}
                              >
                                <Text
                                  style={[styles.TextWhite, { fontSize: 10 }]}
                                >
                                  वेतन बदलें
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  checkSahayakStatus();
                                  setEdit(false);
                                  setEditMale(false);
                                }}
                                style={{
                                  backgroundColor: "#44A347",
                                  paddingHorizontal: 10,
                                  padding: 5,
                                }}
                              >
                                <Text
                                  style={[styles.TextWhite, { fontSize: 10 }]}
                                >
                                  कन्फर्म
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
              </View>
            </View>

            {usertype && usertype === "Grahak" ? (
              <View
                style={[
                  styles.flex,
                  styles.justifyContentBetween,
                  { marginBottom: 20 },
                ]}
              >
                <View
                  style={[
                    styles.TaxView,
                    styles.flex,
                    styles.justifyContentBetween,
                    ,
                    { marginRight: 5 },
                  ]}
                >
                  <TextInput
                    style={styles.TextInput}
                    placeholder="दिनों की संख्या"
                    editable={false}
                    placeholderTextColor={"#000"}
                  />
                  <Text
                    style={{ marginTop: 5, marginRight: 8, color: "#0099FF" }}
                  >
                    {item?.num_days}
                  </Text>
                </View>
                <View
                  style={[
                    styles.BhumiView,
                    styles.flex,
                    styles.justifyContentBetween,
                  ]}
                >
                  <TextInput
                    style={styles.TextInput}
                    placeholder="वेतन"
                    editable={false}
                    placeholderTextColor={"#000"}
                  />
                  <View style={{ marginRight: 10 }}>
                    {item.status === "Completed" ? (
                      <View>
                        <Text> ₹ {countprice}</Text>
                      </View>
                    ) : acceptedStatus > 0 ? (
                      <View>
                        <Text> ₹ {countprice}</Text>
                      </View>
                    ) : (
                      <View>
                        <Text> ₹ {item.total_amount_sahayak}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                  ,
                  { marginRight: 5, position: "relative", marginBottom: 20 },
                ]}
              >
                <TextInput
                  style={styles.TextInput}
                  placeholder="दिनों की संख्या"
                  placeholderTextColor={"#000"}
                />
                <Text
                  style={{ position: "absolute", right: 5, color: "#0099FF" }}
                >
                  {item?.num_days}
                </Text>
              </View>
            )}
            <View>
              {thekeparpending?.map((item, index) => (
                <View
                  key={item?.id}
                  style={[
                    styles.flex,
                    styles.justifyContentBetween,
                    { flexWrap: "wrap" },
                  ]}
                >
                  {item.status === "Pending" && (
                    <>
                      {[...Array(parseInt(item?.count_male)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              styles.justifyContentBetween,
                              {
                                paddingHorizontal: 5,
                                borderColor: "#0070C0",
                                // borderRadius: 7,
                                borderWidth: 0.4,
                                paddingVertical: 10,
                                maxWidth: "33.33%",
                                width: "100%",
                                marginBottom: 5,
                                fontFamily: "Devanagari-regular",
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="पुरषो"
                              editable={false}
                              placeholderTextColor={"#000"}
                              name={`Male${index + 1}`}
                            />
                            <View
                              style={{
                                height: 25,
                                paddingHorizontal: 5,
                                backgroundColor:
                                  item.status === "Pending"
                                    ? "#44A347"
                                    : "#0099FF",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 12,
                                    fontFamily: "Devanagari-bold",
                                    fontWeight: "600",
                                  }}
                                >
                                  {item?.status === "Pending"
                                    ? "पेंडिंग"
                                    : "स्वीकार"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                      {[...Array(parseInt(item?.count_female)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              styles.justifyContentBetween,
                              {
                                paddingHorizontal: 5,
                                borderColor: "#0070C0",
                                // borderRadius: 7,
                                borderWidth: 0.4,
                                paddingVertical: 10,
                                maxWidth: "33.33%",
                                width: "100%",
                                marginBottom: 5,
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="महिला"
                              editable={false}
                              placeholderTextColor={"#101010"}
                              name={`Female${index + 1}`}
                            />
                            <View
                              style={{
                                height: 25,
                                paddingHorizontal: 5,
                                backgroundColor:
                                  item.status === "Pending"
                                    ? "#44A347"
                                    : "#0099FF",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: "600",
                                    fontFamily: "Devanagari-bold",
                                  }}
                                >
                                  {item?.status === "Pending"
                                    ? "पेंडिंग"
                                    : "स्वीकार"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                    </>
                  )}
                </View>
              ))}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {Array.from({ length: acceptfemale }, (_, index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={{ ...styles.CheckTextInput }}
                            placeholder="महिला"
                            editable={false}
                            placeholderTextColor={"#101010"}
                            name={`Female${index + 1}`}
                          />
                          <View
                            style={{
                              height: 25,
                              paddingHorizontal: 5,
                              backgroundColor: "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            <TouchableOpacity>
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 5,
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: "600",
                                  fontFamily: "Devanagari-bold",
                                }}
                              >
                                स्वीकार
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                      {Array.from({ length: acceptmale }, (_, index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={{ ...styles.CheckTextInput }}
                            placeholder="पुरुष"
                            editable={false}
                            placeholderTextColor={"#101010"}
                            name={`Female${index + 1}`}
                          />
                          <View
                            style={{
                              height: 25,
                              paddingHorizontal: 5,
                              backgroundColor: "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            <TouchableOpacity>
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 5,
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: "600",
                                  fontFamily: "Devanagari-bold",
                                }}
                              >
                                स्वीकार
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  <></>
                </View>
              </View>
            </View>
            <>
              {item.status != "Pending" &&
                usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {[...Array(parseInt(item?.count_male)).keys()].map(
                      (index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={styles.CheckTextInput}
                            placeholder="पुरषो"
                            editable={false}
                            placeholderTextColor={"#000"}
                            name={`Male${index + 1}`}
                          />
                          <View
                            style={{
                              // height: 25,
                              paddingHorizontal: 5,
                              backgroundColor:
                                item.status === "Pending"
                                  ? "#44A347"
                                  : "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            <View key={index}>
                              {item?.status === "Pending"
                                ? getStatusButton(item?.status, "पेंडिंग")
                                : item?.status === "Accepted"
                                ? getStatusButton(item?.status, "स्वीकार")
                                : item?.status === "Booked"
                                ? getStatusButton(item?.status, "बुक्ड")
                                : item?.status === "Ongoing"
                                ? getStatusButton(item?.status, "जारी है ")
                                : item?.status === "Completed"
                                ? getStatusButton(item?.status, "समाप्त")
                                : null}
                            </View>
                          </View>
                        </View>
                      )
                    )}
                    {[...Array(parseInt(item?.count_female)).keys()].map(
                      (index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={{ ...styles.CheckTextInput }}
                            placeholder="महिला"
                            editable={false}
                            placeholderTextColor={"#101010"}
                            name={`Female${index + 1}`}
                          />
                          <View
                            style={{
                              // height: 25,
                              paddingHorizontal: 5,
                              backgroundColor:
                                item.status === "Pending"
                                  ? "#44A347"
                                  : "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            <View key={index}>
                              {item?.status === "Pending"
                                ? getStatusButton(item?.status, "पेंडिंग")
                                : item?.status === "Accepted"
                                ? getStatusButton(item?.status, "स्वीकार")
                                : item?.status === "Booked"
                                ? getStatusButton(item?.status, "बुक्ड")
                                : item?.status === "Ongoing"
                                ? getStatusButton(item?.status, "जारी है ")
                                : item?.status === "Completed"
                                ? getStatusButton(item?.status, "समाप्त")
                                : null}
                            </View>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                )}
            </>

            {item.status === "Pending" && usertype === "Sahayak" && (
              <View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <>
                    {item?.count_female > 0 &&
                      [...Array(parseInt(item?.count_female)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              styles.justifyContentBetween,
                              {
                                paddingHorizontal: 3,
                                borderColor: "#0070C0",
                                paddingVertical: 10,
                                maxWidth: "33.33%",
                                width: "100%",
                                marginBottom: 5,
                                borderWidth: 0.4,
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="महिला"
                              editable={false}
                              placeholderTextColor="#101010"
                              name={`Female${index + 1}`}
                              onChangeText={(text) => {
                                const updatedStatus = { ...checkboxStatus };
                                updatedStatus[index] = text;
                                setCheckboxStatus(updatedStatus);
                              }}
                            />
                            <View
                              style={{
                                paddingBottom: 5,
                                paddingHorizontal: 3,
                                backgroundColor:
                                  checkboxStatus[index] === "Accepted"
                                    ? "#0099FF"
                                    : "#44A347",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleCheckboxChange(index)}
                                // disabled={checkboxStatus[index] === "Pending"}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 11,
                                    paddingHorizontal: 10,
                                    fontWeight: "600",
                                    fontFamily: "Devanagari-regular",
                                  }}
                                >
                                  {checkboxStatus[index] === "Accepted"
                                    ? "स्वीकार"
                                    : "पेंडिंग"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                  </>
                  <>
                    {item?.count_male > 0 &&
                      [...Array(parseInt(item?.count_male)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              styles.justifyContentBetween,
                              {
                                paddingHorizontal: 3,
                                borderColor: "#0070C0",
                                paddingVertical: 10,
                                maxWidth: "33.33%",
                                width: "100%",
                                marginBottom: 5,
                                borderWidth: 0.4,
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="पुरषो"
                              placeholderTextColor="#101010"
                              name={`Male${index + 1}`}
                              editable={false}
                              onChangeText={(text) => {
                                const updatedMaleStatuses = [...maleStatuses];
                                updatedMaleStatuses[index] = text;
                                setMaleStatuses(updatedMaleStatuses);
                              }}
                            />
                            <View
                              style={{
                                paddingBottom: 5,
                                paddingHorizontal: 3,
                                backgroundColor:
                                  maleStatuses[index] === "Accepted"
                                    ? "#0099FF"
                                    : "#44A347",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleAcceptMale(index)}
                                // disabled={maleStatuses[index] === "Pending"}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 11,
                                    paddingHorizontal: 10,
                                    fontWeight: "600",
                                    fontFamily: "Devanagari-regular",
                                  }}
                                >
                                  {maleStatuses[index] === "Accepted"
                                    ? "स्वीकार"
                                    : "पेंडिंग"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                  </>
                </View>

                <View style={[styles.flex, styles.justifyContentBetween]}>
                  <View
                    style={[
                      styles.flex,
                      // styles.justifyContentBetween,
                      { flexWrap: "wrap", marginTop: 20 },
                    ]}
                  ></View>
                </View>
              </View>
            )}

            <View style={{ width: "100%" }}>
              {usertype && usertype === "Grahak" && (
                <View>
                  {item.status === "Completed" ? (
                    <View>
                      <>
                        <View
                          style={[
                            {
                              borderColor: "#0070C0",
                              borderRadius: 7,
                              // borderBottomRightRadius: 7,

                              height: 48,
                              marginTop: 10,
                              borderWidth: 1,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            },
                          ]}
                        >
                          <TextInput
                            style={styles.TextInput}
                            placeholder="काम की स्थिति"
                            editable={false}
                            placeholderTextColor={"#000"}
                            // onChangeText={(email) => setEmail(email)}
                            // defaultValue={email}
                            // value={email}
                          />

                          <View style={{ marginRight: 10 }}>
                            <View style={{ width: "100%" }}>
                              <TouchableOpacity key={item.id}>
                                <Text style={styles.accepted}>
                                  {countAcceptedJobs} सहायक समाप्त करे
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity style={[styles.BhuktanBtn]}>
                          <Text style={[styles.loginText, { color: "#fff" }]}>
                            समाप्त
                          </Text>
                        </TouchableOpacity>
                      </>
                    </View>
                  ) : (
                    <View>
                      {acceptedStatus > 0 ? (
                        <>
                          <View
                            style={[
                              {
                                borderColor: "#0070C0",
                                borderRadius: 7,
                                // borderBottomRightRadius: 7,

                                height: 48,
                                marginTop: 10,
                                borderWidth: 1,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              },
                            ]}
                          >
                            <TextInput
                              style={styles.TextInput}
                              placeholder="काम की स्थिति"
                              editable={false}
                              placeholderTextColor={"#000"}
                              // onChangeText={(email) => setEmail(email)}
                              // defaultValue={email}
                              // value={email}
                            />

                            <View style={{ marginRight: 10 }}>
                              <View style={{ width: "100%" }}>
                                <TouchableOpacity key={item.id}>
                                  <Text style={styles.accepted}>
                                    {countAcceptedJobs} सहायक स्वीकार करे
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.BhuktanBtn]}
                            onPress={() => {
                              // navigation.replace("Payment", {
                              //   item,
                              //   fawdafee: fawdafees,
                              //   countprice,
                              //   acceptfemale,
                              //   acceptmale,
                              //   totalamount,
                              //   id: jobId,
                              // })
                              checkStatus();
                            }}
                          >
                            <Text style={[styles.loginText, { color: "#fff" }]}>
                              भुगतान करें
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <View
                            style={[
                              {
                                borderColor: "#0070C0",
                                borderRadius: 7,
                                // borderBottomRightRadius: 7,

                                height: 48,
                                marginTop: 10,
                                borderWidth: 1,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              },
                            ]}
                          >
                            <TextInput
                              style={styles.TextInput}
                              placeholder="काम की स्थिति"
                              editable={false}
                              placeholderTextColor={"#000"}
                              // onChangeText={(email) => setEmail(email)}
                              // defaultValue={email}
                              // value={email}
                            />

                            <View style={{ marginRight: 10 }}>
                              <View style={{ width: "100%" }}>
                                <TouchableOpacity key={item.id}>
                                  <Text style={styles.pending}>
                                    0 सहायक स्वीकार करे
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.BhuktanBtn, { opacity: 0.5 }]}
                            disabled={true}
                          >
                            <Text style={[styles.loginText, { color: "#fff" }]}>
                              भुगतान करें
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>

            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <>
                {usertype &&
                  (usertype === "Sahayak" || usertype === "MachineMalik") &&
                  item?.status !== "Pending" && (
                    <>
                      <CustomComponent
                        label="किसान से वेतन"
                        value={item.total_amount_sahayak}
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
            <View style={{ width: "100%" }}>
              {usertype === "Sahayak" || usertype === "MachineMalik" ? (
                <>
                  <View style={{ marginTop: 10 }}>
                    {item?.status === "Pending" ? (
                      <TouchableOpacity
                        style={styles.BhuktanBtn}
                        disabled={isButtonDisabled}
                        onPress={() => checkPayment()}
                      >
                        <Text style={[styles.loginText, { color: "#fff" }]}>
                          काम स्वीकार करें
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      thekeperKam?.map((item) => (
                        <View key={item.id}>
                          <>
                            {item.status === "Accepted" ? (
                              <>
                                <TouchableOpacity
                                  style={[styles.BhuktanBtn]}
                                  disabled={true}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      { color: "#fff" },
                                    ]}
                                  >
                                    {item?.status === "Accepted"
                                      ? "काम स्वीकृत "
                                      : item?.status === "Booked"
                                      ? "बुक्ड"
                                      : item?.status === "Ongoing"
                                      ? "जारी है "
                                      : ""}
                                  </Text>
                                </TouchableOpacity>
                              </>
                            ) : item.status === "Ongoing" ||
                              item.status === "Booked" ? (
                              <>
                                <TouchableOpacity
                                  style={[styles.BhuktanBtn]}
                                  disabled={true}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      { color: "#fff" },
                                    ]}
                                  >
                                    {item?.status === "Accepted"
                                      ? "काम स्वीकृत "
                                      : item?.status === "Booked"
                                      ? "बुक्ड"
                                      : item?.status === "Ongoing"
                                      ? "जारी है "
                                      : ""}
                                  </Text>
                                </TouchableOpacity>
                                <View
                                  style={[styles.inputView, { height: 40 }]}
                                >
                                  <Text style={styles.label}>
                                    ग्राहक का नाम
                                  </Text>
                                  <TextInput
                                    style={styles.TextInput}
                                    editable={false}
                                    placeholderTextColor="#000000"
                                    placeholder={item.grahak_name}
                                  />
                                </View>
                                <View
                                  style={[styles.inputView, { height: 40 }]}
                                >
                                  <Text style={styles.label}>फ़ोन:</Text>
                                  <TextInput
                                    style={styles.TextInput}
                                    editable={false}
                                    placeholderTextColor="#000000"
                                    placeholder={item.grahak_phone}
                                  />
                                </View>
                              </>
                            ) : (
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  // marginTop: 20,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <TouchableOpacity
                                  style={[
                                    styles.BhuktanBtn,
                                    { width: "95%", marginBottom: 10 },
                                  ]}
                                  onPress={() => {
                                    if (itemStatus !== "Completed") {
                                      navigation.replace("HomeStack", {
                                        screen: "BottomTab",
                                      });
                                    }
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      {
                                        color: "#fff",
                                        fontFamily: "Devanagari-regular",
                                      },
                                    ]}
                                  >
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
                          </>
                          {item.status === "Accepted" && (
                            <View>
                              <View style={{ marginTop: "auto", padding: 5 }}>
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
                                  <Text style={styles.label}>टिप्पणी</Text>
                                  <Text
                                    style={[
                                      styles.TextInput,
                                      { maxWidth: "98%" },
                                    ]}
                                  >
                                    कृपया किसान द्वारा बुकिंग की पुष्टि करने की
                                    प्रतीक्षा करें!
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: "#D9D9D9",
                                    alignSelf: "center",
                                    paddingHorizontal: 50,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    marginTop: 10,
                                  }}
                                  onPress={() => {
                                    if (!isLoading) {
                                      myStatusBooked();
                                    }
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      {
                                        color: "#fff",
                                        fontFamily: "Devanagari-bold",
                                      },
                                    ]}
                                  >
                                    रद्द करें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}

                          {item.status === "Booked" && (
                            <View>
                              <View style={{ marginTop: "auto", padding: 5 }}>
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
                                  <Text style={styles.label}>टिप्पणी</Text>
                                  <Text
                                    style={[
                                      styles.TextInput,
                                      { maxWidth: "98%" },
                                    ]}
                                  >
                                    कृपया ऊपर दिए गए नंबर पर संपर्क करें और
                                    कृपया नौकरी के लिए समय पर पहुंचें
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: "#D9D9D9",
                                    alignSelf: "center",
                                    paddingHorizontal: 50,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    marginTop: 10,
                                  }}
                                  onPress={() => {
                                    if (!isLoading) {
                                      RejectedPayment();
                                    }
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      {
                                        color: "#fff",
                                        fontFamily: "Devanagari-bold",
                                      },
                                    ]}
                                  >
                                    रद्द करें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      ))
                    )}
                  </View>
                </>
              ) : null}
            </View>
            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype &&
                usertype === "Grahak" &&
                itemStatus !== "Completed" && (
                  <>
                    <View
                      style={[
                        styles.inputView,
                        styles.flex,
                        styles.justifyContentBetween,
                        {
                          height: 120,
                        },
                      ]}
                    >
                      <Text style={styles.label}>टिप्पणी</Text>
                      {statusPending === "Pending" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          काम स्वीकृत होने की प्रतीक्षा करें ! स्वीकृत होने पर
                          आपको सूचित किया जाएगा
                        </Text>
                      )}
                      {statusAccept === "Accepted" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          जितने सहायक हैं उतने स्वीकार करें या सभी सहायकों के
                          आने की प्रतीक्षा करें! फिर आपको भुगतान के लिए सूचित
                          किया जाएगा! {"\n"}बुकिंग कन्फर्म करने के लिए कृपा
                          भुगतान करें!
                        </Text>
                      )}
                    </View>
                  </>
                )}
            </View>
            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype && usertype === "Grahak" && (
                <View>
                  {acceptedStatus > 0 ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#D9D9D9",
                        alignSelf: "center",
                        paddingHorizontal: 50,
                        paddingVertical: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        if (!isLoading) {
                          cancel();
                        }
                      }}
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        रद्द करें
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    item.status !== "Completed" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#D9D9D9",
                          alignSelf: "center",
                          paddingHorizontal: 50,
                          paddingVertical: 10,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          if (!isLoading) {
                            cancel();
                          }
                        }}
                      >
                        <Text style={[styles.loginText, { color: "#fff" }]}>
                          रद्द करें
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
            </View>
            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") &&
                status === "Completed" &&
                itemStatus !== "Completed" && (
                  <>
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
                      <Text style={styles.label}>टिप्पणी</Text>
                      {/* {status === "Accepted" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          कृपया किसान द्वारा बुकिंग की पुष्टि करने की प्रतीक्षा
                          करें!
                        </Text>
                      )} */}
                      {/* {status === "Booked" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          कृपया ऊपर दिए गए नंबर पर संपर्क करें और कृपया नौकरी के
                          लिए समय पर पहुंचें
                        </Text>
                      )} */}
                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        धन्यवाद! कुछ देर बाद भुगतान आपके खाते में आ जाएगा!
                        {"\n"}कृपया आगे बढ़ने के लिए "समाप्त" पर क्लिक करें!
                      </Text>
                    </View>
                  </>
                )}
            </View>
          </View>
        </ScrollView>
      )}
      {/* <BottomTab/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  MaleCheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    width: "30%",
    height: 55,
    marginTop: 10,
    borderWidth: 1,
  },

  // FemalecheckView:{
  //     borderColor: "#0070C0",
  //     borderRadius: 7,
  //     borderBottomLeftRadius: 0,
  //     borderTopLeftRadius:0,
  //     width: "30%",
  //     height: 48,
  //     // marginTop: 30,
  //     borderWidth: 1,
  // },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "30%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#DCDCDC",
  },

  BhuktanBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
    fontFamily: "Devanagari-bold",
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
    marginTop: 10,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    padding: 10,
    fontFamily: "Devanagari-regular",

    // fontFamily: "Poppin-Light"
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 0,
    fontFamily: "Devanagari-regular",
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 10,

    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "52%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  DateView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  TimeView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  JobStatusView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "43%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  AmountView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "43%",
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
    width: "33.33%",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    // width: "33.33%",
    borderBottomWidth: 0.4,
    borderLeftWidth: 0.4,
    borderRightWidth: 0.4,
    height: 55,

    borderWidth: 1,
  },
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  TextWhite: {
    color: "#fff",
    fontFamily: "Devanagari-bold",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontFamily: "Devanagari-bold",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  accepted: {
    textAlign: "center",
    backgroundColor: "#0099FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Devanagari-regular",
  },
  pending: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#44A347",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Devanagari-regular",
  },
});

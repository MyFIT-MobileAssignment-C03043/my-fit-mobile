import StatusCell from "@/components/card/StatusCell";
import { useTodayData } from "@/hooks/useTodayHealthData";
import { setTodayData } from "@/store/features/user/todayDataSlice";
import { setUserInfo } from "@/store/features/user/userSlice";
import { useGetUserQuery } from "@/store/services/apis/userApi";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PieChart from "react-native-pie-chart";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetUserQuery();
  const [BMI, setBMI] = useState<number>(0);

  const { todayData } = useTodayData();

  useEffect(() => {
    if (todayData) {
      dispatch(
        setTodayData({
          ...todayData,
        })
      );
    }
  }, [todayData]);

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo({ ...data }));

      if (!data.height || !data.weight) {
        Toast.show({
          text1: "Ooh!",
          text2: "You have not updated weight and height to calculate BMI.",
          type: "info",
        });
      } else {
        if (data.height > 0 && data.weight > 0) {
          const bmi = Math.round(data.weight / (data.height / 100) ** 2);
          console.log("bmi: ", bmi);

          if (bmi < 10 || bmi > 60) {
            Toast.show({
              text1: "Ooh!",
              text2:
                "Your height or weight is invalid to calculate BMI! Please enter a valid height or weight.",
              type: "error",
            });
            setBMI(0);
          } else {
            setBMI(bmi);
          }
        } else {
          Toast.show({
            text1: "Ooh!",
            text2:
              "Your height or weight is 0! Please enter a valid height or weight.",
            type: "info",
          });
        }
      }
    }
  }, [data]);

  function classifyBMI(bmi: number): string {
    if (bmi > 0 && bmi < 16) {
      return "Severe malnutrition!!!";
    } else if (bmi >= 16 && bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "Overweight";
    } else if (bmi >= 30) {
      return "Obese";
    } else {
      return "N/A BMI";
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{ paddingTop: Platform.OS === "android" ? 50 : 0 }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text
                  style={
                    data
                      ? styles.userNameText
                      : { ...fonts.bodySmall, color: colors.tertiary3 }
                  }
                >
                  {data ? data.name : "Loading..."}
                </Text>
              </View>
              <Ionicons name="notifications-outline" size={25} color="#000" />
            </View>
            <View style={styles.bodyFatContainer}>
              {/* Các chấm tròn */}
              <View style={[styles.dot, { top: 20, right: 120 }]} />
              <View style={[styles.dot, { top: 10, left: 140 }]} />
              <View style={[styles.dot, { bottom: 20, right: 150 }]} />
              <View style={[styles.dot, { bottom: 20, left: 150 }]} />
              <View
                style={[
                  styles.dot,
                  { bottom: -25, left: -25 },
                  { width: 60, height: 60 },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { bottom: -20, right: -30 },
                  { width: 70, height: 70 },
                ]}
              />
              <View style={{ gap: 15, flexShrink: 1 }}>
                <View>
                  <Text
                    style={{
                      ...fonts.titleSmall,
                      color: "#fff",
                      marginBottom: 5,
                    }}
                  >
                    BMI (Body Mass Index)
                  </Text>
                  <Text style={{ ...fonts.bodySmall, color: "#fff" }}>
                    {BMI === 0 ? "N/A" : `You have a ${classifyBMI(BMI)}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: colors.primary2,
                    alignSelf: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ ...fonts.bodySmall, color: "#fff" }}>
                    View more
                  </Text>
                </TouchableOpacity>
              </View>
              <PieChart
                widthAndHeight={100}
                series={[
                  {
                    value: BMI * 10,
                    color: colors.primary2,
                    label: {
                      text: BMI.toFixed(2) + "%",
                      stroke: "#fff",
                      fontSize: 10,
                      fontWeight: 200,
                      offsetX: 5,
                      offsetY: -5,
                    },
                  },
                  {
                    value: 1000 - BMI * 10,
                    color: "#fff",
                    label:
                      BMI === 0
                        ? { text: "N/A", offsetX: 0, offsetY: -20 }
                        : undefined,
                  },
                ]}
              />
            </View>
            <View style={styles.todayTargetContainer}>
              <View style={styles.todayTargetContainerBg}></View>
              <Text style={{ ...fonts.bodyMedium }}>Today target</Text>
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: colors.primary1,
                  borderRadius: 15,
                }}
                onPress={() => {
                  router.push("/(tabs)/(home)/todayTarget");
                }}
              >
                <Text style={{ ...fonts.labelSmall, color: "#fff" }}>
                  Check
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todayStatus}>
              <Text style={{ ...fonts.titleMedium, marginBottom: 10 }}>
                Today status
              </Text>
              <View style={{ gap: 15 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <StatusCell
                    type="Sleep"
                    values={[
                      {
                        unit: "h",
                        value: Math.floor(todayData.sleep / 60).toFixed(0),
                      },
                      { unit: "m", value: (todayData.sleep % 60).toFixed(0) },
                    ]}
                    image={require("../../../assets/images/Sleep-Graph.png")}
                    joiner=" "
                    valuesPrintHorizontal
                    imageStyle={{ width: 120 }}
                  />
                  <StatusCell
                    type="Calories & Water"
                    values={[
                      { unit: "kCal", value: todayData.calories.toFixed(0) },
                      { unit: "L", value: todayData.water.toFixed(2) },
                    ]}
                    image={require("../../../assets/images/basicfood.png")}
                    imageStyle={{
                      position: "absolute",
                      bottom: -8,
                      right: 20,
                      width: 100,
                      height: 100,
                      zIndex: -1,
                    }}
                  />
                  <StatusCell
                    type="Walking"
                    values={[
                      { unit: "step", value: todayData.walking.toString() },
                    ]}
                    image={require("../../../assets/images/statusCellWalking.png")}
                  />
                  <StatusCell
                    type="Activities"
                    values={[
                      {
                        unit: "h",
                        value: Math.floor(todayData.activityTime / 60).toFixed(
                          0
                        ),
                      },
                      {
                        unit: "m",
                        value: (todayData.activityTime % 60).toFixed(0),
                      },
                    ]}
                    joiner=" "
                    image={require("../../../assets/images/statusActivities.png")}
                    valuesPrintHorizontal
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function formatMinutesToHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours !== 0 && minutes !== 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours !== 0) {
    return `${hours} hours`;
  } else if (minutes !== 0) {
    return `${minutes} minutes`;
  } else {
    return "0 hours";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    // marginBottom: Platform.OS === "android" ? 60 : 20,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {},
  welcomeText: {
    ...fonts.bodySmall,
    color: "#ADA4A5",
  },
  userNameText: {
    ...fonts.titleMedium,
    fontSize: 20,
  },

  bodyFatContainer: {
    width: "100%",
    height: "20%",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#38CE38",
    borderRadius: 22,
    position: "relative",
    overflow: "hidden",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    opacity: 0.2,
  },
  todayTargetContainer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  todayTargetContainerBg: {
    backgroundColor: "#05CAA3",
    opacity: 0.2,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  todayStatus: {
    width: "100%",
  },
});

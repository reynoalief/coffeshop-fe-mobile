import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FormData from "form-data";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import commonStyle from "../../src/assets/styles/commonStyle";
import * as ImagePicker from "expo-image-picker";
import styles from "./style";

export default function EditProfile({ navigation, route }) {
  const { ID } = route.params;

  const [refetch, setRefetch] = useState(false);
  const [dataUser, setDataUser] = useState({
    id: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    username: "",
    image: "",
    gender: "",
    phone: "",
    birthday: "",
    delivery_address: "",
    role: "",
  });

  const URL = `https://coffeshop-mobile.up.railway.app`;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${URL}/api/v1/users/${ID}`);
        const data = await response?.data?.data;
        setDataUser(data);
        setRefetch(!refetch);
        // setRefetch(true);
      } catch (error) {
        error;
      }
    };
    getUser();
  }, [ID, refetch]);

  const [imagePreview, setImagePreview] = useState(null);
  const [dataInput, setDataInput] = useState({
    username: "",
    email: "",
    phone: "",
    birthday: "",
    delivery_address: "",
  });

  const editAvatar = () => {
    Alert.alert("Edit Avatar", `You will update your avatar`, [
      { text: "Take a picture", onPress: () => pickImageFromCamera() },
      { text: "Take from gallery", onPress: () => pickImageFromGallery() },
    ]);
  };

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
    }
  };

  const handleEditProfile = () => {
    const formDataUser = new FormData();
    formDataUser.append("username", dataInput.username);
    formDataUser.append("email", dataInput.email);
    formDataUser.append("phone", dataInput.phone);
    formDataUser.append("birthday", dataInput.birthday);
    formDataUser.append("delivery_address", dataInput.delivery_address);
    formDataUser.append("avatar", {
      uri: imagePreview,
      name: `profile-${Date.now()}.jpg`,
      type: "image/jpg",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
      },
    };

    axios
      .patch(
        `https://coffeshop-mobile.up.railway.app/api/v1/users/${ID}`,
        formDataUser,
        config
      )
      .then((result) => {
        console.log(result);
        result.data.message;
        ToastAndroid.show(result.data.message, ToastAndroid.SHORT);
      })
      .catch((err) => {
        console.log(err.message);
        err;
        ToastAndroid.show("Failed to edit profile! 😐", ToastAndroid.SHORT);
      });
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[commonStyle.px40, styles.container]}>
        <View style={styles.navbar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={require("../../src/assets/images/go-back-2.png")} />
          </Pressable>
          <Text style={styles.headerText}>Edit Profile</Text>
          <Text>{""}</Text>
        </View>

        <TouchableOpacity
          style={styles.imageWrapper}
          activeOpacity={0.7}
          onPress={editAvatar}
        >
          <Image
            style={styles.image}
            source={
              imagePreview
                ? { uri: imagePreview }
                : dataUser.image
                ? {
                    uri: `https://coffeshop-mobile.up.railway.app/uploads/images/${dataUser.image}`,
                  }
                : require("../../src/assets/images/default-avatar.jpg")
            }
          />
          <Pressable style={styles.editPencilWrapper}>
            <Image
              style={styles.editPencil}
              source={require("../../src/assets/images/edit-pencil.png")}
            />
          </Pressable>
        </TouchableOpacity>

        <View>
          <Text style={styles.labelForm}>Name :</Text>
          <TextInput
            onChangeText={(text) => {
              setDataInput({
                ...dataInput,
                username: text,
              });
            }}
            placeholder={dataUser?.username}
            style={styles.inputForm}
          />
        </View>
        <View>
          <Text style={styles.labelForm}>Email Address :</Text>
          <TextInput
            onChangeText={(text) =>
              setDataInput({
                ...dataInput,
                email: text,
              })
            }
            placeholder={dataUser?.email ? dataUser?.email : "-"}
            style={styles.inputForm}
          />
        </View>
        <View>
          <Text style={styles.labelForm}>Phone Number :</Text>
          <TextInput
            onChangeText={(text) =>
              setDataInput({
                ...dataInput,
                phone: text,
              })
            }
            placeholder={dataUser?.phone ? dataUser?.phone : "-"}
            style={styles.inputForm}
          />
        </View>
        <View>
          <Text style={styles.labelForm}>Date of Birth :</Text>
          <View style={styles.inputBirthDate}>
            <TextInput
              onChangeText={(text) =>
                setDataInput({
                  ...dataInput,
                  birthday: text,
                })
              }
              placeholder={
                dataUser?.birthday !== "null" ? dataUser?.birthday : "-"
              }
            />
            <Pressable>
              <Image source={require("../../src/assets/images/calendar.png")} />
            </Pressable>
          </View>
        </View>
        <View style={{ marginBottom: 40 }}>
          <Text style={styles.labelForm}>Delivery Address :</Text>
          <TextInput
            onChangeText={(text) =>
              setDataInput({
                ...dataInput,
                delivery_address: text,
              })
            }
            placeholder={
              dataUser?.delivery_address !== "null"
                ? dataUser?.delivery_address
                : "-"
            }
            style={styles.inputForm}
          />
        </View>

        <TouchableOpacity
          style={[commonStyle.brownButton]}
          onPress={handleEditProfile}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
            Save and Update
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

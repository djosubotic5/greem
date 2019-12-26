import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as Permissions from "expo-permissions";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";

const firebase = require("firebase");
require("firebase/firestore");

export default class PostScreen extends React.Component {
  state = {
    text: "",
    image: null
  };

  componentDidMount() {
    this.getPhotoPermission();
  }

  getPhotoPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status != "granted") {
      alert("We need permission to access your camera roll");
    }
  };

  handlePost = () => {
    Fire.shared
      .addPost({ text: this.state.text.trim(), localUri: this.state.image })
      .then(ref => {
        this.setState({ text: "", image: null });
        this.props.navigation.goBack();
      })
      .catch(error => {
        alert(error);
      });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  avatarSwitch() {
    if (this.state.image === null) {
      return (
        <TouchableOpacity style={styles.avatar} onPress={this.pickImage}>
          <Ionicons
            name="md-camera"
            size={40}
            color="#FFF"
            style={{ marginTop: 6, marginLeft: 2 }}
          ></Ionicons>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.avatar} onPress={this.pickImage}>
          <Image
            source={{ uri: this.state.image }}
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
          ></Image>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePost}>
            <Text style={{ fontWeight: "500" }}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View
            style={{
              position: "absolute",
              top: 90,
              alignItems: "center",
              width: "100%"
            }}
          >
            {this.avatarSwitch()}
          </View>

          <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={4}
            style={{ flex: 1 }}
            placeholder="How you want to name Greem?"
            style={{ marginHorizontal: 50 }}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            textAlign={"center"}
          ></TextInput>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 26,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB"
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E2E6",
    justifyContent: "center",
    alignItems: "center"
  }
});

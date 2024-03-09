import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ quality: 0.5 });
      savePictureToGallery(photo);
    }
  };

  const savePictureToGallery = async (photo) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      MediaLibrary.createAlbumAsync("Selfies", asset)
        .then(() => {
          alert('Picture saved to "Selfies" album in your gallery!');
        })
        .catch((error) => {
          console.error("Error creating album:", error);
        });
    } else {
      alert("Permission to access media library denied");
    }
  };

  if (hasCameraPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        ref={(ref) => setCameraRef(ref)}
      />
      <Button title="Take a Selfie" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
});

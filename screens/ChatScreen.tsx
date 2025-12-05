import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { 
  auth, 
  db, 
  storage,
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  signOut,
  ref,
  uploadBytes,
  getDownloadURL
} from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

type MessageType = {
  id: string;
  text: string;
  sender: string; 
  createdAt: any;
  uid: string;
  imageUrl?: string;
};

export default function ChatScreen({ navigation: _navigation, route }: Props) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const currentUser = auth.currentUser;
  const username = currentUser?.email?.split('@')[0] || route.params?.name || "Guest";

  useEffect(() => {
    const loadCachedMessages = async () => {
      try {
        const cached = await AsyncStorage.getItem("chat_messages");
        if (cached) {
          setMessages(JSON.parse(cached));
        }
      } catch (e) {
        console.log("Failed to load cached messages", e);
      }
    };

    loadCachedMessages();

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as MessageType));
      
      setMessages(msgs);
      AsyncStorage.setItem("chat_messages", JSON.stringify(msgs)).catch(console.error);
      
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: input.trim(),
        sender: username,
        uid: currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (error: any) {
      console.error("Send Error:", error);
      Alert.alert("Error", "Gagal mengirim pesan: " + error.message);
    }
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (result.didCancel || !result.assets || !result.assets[0]) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    setUploading(true);
    try {
      const filename = asset.uri.substring(asset.uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${Date.now()}_${filename}`);
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", asset.uri!, true);
        xhr.send(null);
      });

      await uploadBytes(storageRef, blob);
      // @ts-ignore
      blob.close(); 

      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "messages"), {
        text: "📷 Image",
        imageUrl: downloadURL,
        sender: username,
        uid: currentUser?.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Upload Error (full payload):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Upload Error:", error);
      Alert.alert("Upload Gagal", error.message || "Terjadi kesalahan yang tidak diketahui (storage/unknown)");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMe = item.uid === currentUser?.uid;

    return (
      <View style={[styles.bubbleContainer, isMe ? styles.rightAlign : styles.leftAlign]}>
        {!isMe && <Text style={styles.senderName}>{item.sender}</Text>}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.messageImage} 
              resizeMode="cover"
            />
          ) : null}
          {item.text && (!item.imageUrl || item.text !== "📷 Image") && (
            <Text style={[styles.msgText, isMe ? styles.myText : styles.otherText]}>
              {item.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require("../assets/Logo.png")} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          <View>
            <Text style={styles.headerTitle}>Informatika Forum</Text>
            <Text style={styles.headerSubtitle}>Logged in as {username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={24} color="#E76F51" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity 
            onPress={handleImagePick} 
            style={styles.iconButton}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#b39673ff" />
            ) : (
              <Icon name="camera-outline" size={28} color="#b39673ff" />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 80,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6d5940ff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#967d5fff",
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: "#E76F51",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  bubbleContainer: {
    marginBottom: 15,
    maxWidth: "80%",
  },
  leftAlign: {
    alignSelf: "flex-start",
  },
  rightAlign: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  senderName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
  },
  myBubble: {
    backgroundColor: "#b39673ff",
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myText: {
    color: "#fff",
  },
  otherText: {
    color: "#333",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  sendBtn: {
    padding: 10,
    backgroundColor: "#b39673ff",
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
});

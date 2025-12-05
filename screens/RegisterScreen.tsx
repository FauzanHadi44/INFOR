import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { initializeApp, deleteApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword as createUser } from "firebase/auth";
import { getFirestore, collection as firestoreCollection, addDoc as firestoreAddDoc } from "firebase/firestore";
import {
  auth, 
  db,   
  serverTimestamp,
  firebaseConfig
} from "../firebase"; 
import Icon from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toEmail = (u: string) => `${u}@chatapp.local`;

  const handleRegister = async () => {
    setError(null);
    const name = username.trim();

    if (!name || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    if (name.length < 3) {
      setError("Username minimal 3 karakter");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirm) {
      setError("Password tidak sama");
      return;
    }

    setLoading(true);
    try {
      const email = toEmail(name);
      
      const appName = "RegisterApp";
      let tempApp;
      
      if (getApps().some(app => app.name === appName)) {
        tempApp = getApp(appName);
      } else {
        tempApp = initializeApp(firebaseConfig, appName);
      }

      const tempAuth = getAuth(tempApp);
      const tempDb = getFirestore(tempApp);

      const cred = await createUser(tempAuth, email, password);
      const uid = cred.user.uid;

      if (uid) {
        await firestoreAddDoc(firestoreCollection(tempDb, "users"), {
          uid,
          username: name,
          email: email,
          createdAt: serverTimestamp(),
        });
      }

      Alert.alert(
        "Registrasi Berhasil", 
        "Silakan login dengan akun baru Anda.",
        [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]
      );
    } catch (e: any) {
      let msg = String(e);
      if (msg.includes("auth/email-already-in-use")) {
        msg = "Username sudah dipakai orang lain.";
      } else if (msg.includes("auth/weak-password")) {
        msg = "Password terlalu lemah.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <Image 
                source={require("../assets/Logo.png")} 
                style={styles.logo} 
                resizeMode="contain" 
              />
              <Text style={styles.brandText}>INFORMATIKA FORUM</Text>
            </View>

            <View style={styles.textHeader}>
              <Text style={styles.headline}>Create Account</Text>
              <Text style={styles.subHeadline}>
                <Text style={styles.headlineAccent}>Sign up</Text> to get started.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                  <Icon name="person-outline" size={20} color="#666" style={{marginRight: 10}} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#A0A0A0"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#A0A0A0"
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="alert-circle-outline" size={18} color="#D32F2F" style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.primaryButton, (!username || !password || loading) && styles.buttonDisabled]} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing up..." : "Sign up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}> Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 24, paddingVertical: 36, paddingHorizontal: 30,
    width: "100%", maxWidth: 400, shadowColor: "#000", shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
  },
  logoContainer: { alignItems: 'flex-start', marginBottom: 20 },
  logo: { width: 150, height: 80, marginBottom: 2 },
  brandText: {
    fontSize: 12, fontWeight: "700", color: "#BFA27E", letterSpacing: 2, 
    textAlign: 'left', marginTop: -18, marginLeft: 4
  },
  textHeader: { marginBottom: 28, alignItems: 'flex-start' },
  headline: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", marginBottom: 6, textAlign: 'left' },
  subHeadline: { fontSize: 15, color: "#666", textAlign: 'left' },
  headlineAccent: { color: "#967d5fff", fontWeight: "700" },
  formContainer: { marginBottom: 10 },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8, marginLeft: 4 },
  inputContainer: { 
    flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6",
    borderRadius: 14, height: 54, paddingHorizontal: 12,
  },
  inputIcon: { fontSize: 18, marginRight: 10, opacity: 0.7 },
  input: { flex: 1, height: "100%", color: "#333", fontSize: 15 },
  errorContainer: { backgroundColor: '#FFE5E5', padding: 10, borderRadius: 8, marginBottom: 16 },
  errorText: { color: "#D32F2F", fontSize: 13, textAlign: 'center' },
  primaryButton: { 
    backgroundColor: "#b39673ff", borderRadius: 14, height: 56, justifyContent: "center", 
    alignItems: "center", shadowColor: "#BFA27E", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  bottomText: { color: "#888", fontSize: 14 },
  link: { color: "#967d5fff", fontWeight: "700", fontSize: 14 },
});
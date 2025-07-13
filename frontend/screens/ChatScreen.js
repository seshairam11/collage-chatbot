import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import useFetch from "../function/GetAPI";
import ErrorComponent from "../components/ErrorComponent";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FlatList } from "react-native-gesture-handler";

export default function ChatScreen({ cleanChat, setCleanChat }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [startInit, setStartInit] = useState(false);
    const [error, setError] = useState({});

    const flatListRef = useRef(null);

    const { responseData, isLoadingApi, apiKey, fetchError, serverRequest } = useFetch();
    const appState = useSelector((state) => state.appstate.login_info);


    const handlePress = async () => {
        if (input.trim()) {
            const userMessage = { role: "user", text: input };
            setMessages([...messages, userMessage]);
            fnSubmit()
        }
    };

    async function fnSubmit() {
        let _updateUserDetails = {
            _id: appState._id,
            message: input,
            userType: appState.userType,
        }
        let serverRequestParam = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(_updateUserDetails),
            apiUrl: "/api/v1/livechat",
            apikey: "LIVECHAT"
        };
        serverRequest(serverRequestParam);
        setStartInit(true);
        setInput("")
    }

    function fnLiveChatResult() {
        const botMessage = { role: "bot", text: responseData.message };
        setMessages([...messages, botMessage]);

        let interval = setInterval(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 1000); // ✅ Scroll every 100ms (adjust as needed)

        // ✅ Stop scrolling after a short duration (e.g., 500ms)
        setTimeout(() => {
            clearInterval(interval);
        }, 1500);

        setStartInit(false);
    }
    useEffect(() => {
        if (startInit == true) {
            if (isLoadingApi == true) {
                switch (apiKey) {
                    case "LIVECHAT":
                        fnLiveChatResult();
                        break;
                }
            }
        }
    }, [startInit, isLoadingApi])

    useEffect(() => {
        if (cleanChat) {
            setMessages([]);
            setCleanChat(false);
        }
    }, [cleanChat])

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef} // ✅ Reference to FlatList
                    data={messages}
                    style={{ flex: 1, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={item.role === "user" ? styles.userText : styles.botText}>
                            <Text style={{ color: "white" }}>
                                {item.text}
                            </Text>
                        </View>
                    )}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#303030", minHeight: 60, borderRadius: 20, paddingHorizontal: 10,marginBottom: 10, }}>
                    <TextInput
                        style={{ flex: 1, padding: 8, color: "white" }} // Add necessary styles
                        placeholder="Ask your question..."
                        placeholderTextColor="gray"
                        value={input}
                        onChangeText={(text) => setInput(text)}
                    />
                    <TouchableOpacity onPress={() => handlePress()} style={{ padding: 8, backgroundColor: "white", borderRadius: 20, width: 43 }}>
                        <MaterialIcons name="subdirectory-arrow-left" size={25} color="black" />
                    </TouchableOpacity>
                </View>

                {error.isAuth &&
                    <ErrorComponent
                        header={error.header}
                        body={error.body}
                        setError={setError}
                    />}
            </View >

        </>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#212121" },
    userText: { backgroundColor: "lightblue", padding: 10, margin: 5, borderRadius: 10, fontSize: 16, marginBottom: 5, marginLeft: "auto", maxWidth: 300 },
    botText: { backgroundColor: "lightgreen", padding: 10, margin: 5, borderRadius: 10, fontSize: 16, marginBottom: 5, marginRight: "auto", maxWidth: 300 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});

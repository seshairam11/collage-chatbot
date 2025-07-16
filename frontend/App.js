import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

// Screens and components
import Entry from './screens/Entry';
import Header from './components/Header';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import ChatScreen from './screens/ChatScreen';
import Passage from './screens/Passage';
import ListPassage from './screens/ListPassage';

// Navigation setup
const Stack = createStackNavigator();

const App = () => {
  const navigationRef = useRef();
  const [currentRoute, setCurrentRoute] = useState(null);
  const [cleanChat, setCleanChat] = useState(false);

  // Redux app state
  const appState = useSelector((state) => state.appstate.login_info);

  // Get current route
  const getCurrentRouteName = () => {
    console.log('Current route:', navigationRef.current?.getCurrentRoute()?.name);
    return navigationRef.current?.getCurrentRoute()?.name;
  };

  useEffect(() => {
    if (navigationRef.current) {
      const route = getCurrentRouteName();
      setCurrentRoute(route);
    }
  }, [navigationRef.current]);

  // Show loading while Redux state is initializing
  if (!appState || typeof appState.isAuth === 'undefined') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setCurrentRoute(getCurrentRouteName());
        }}
        onStateChange={() => {
          setCurrentRoute(getCurrentRouteName());
        }}
      >
        {/* Conditional header rendering */}
        {currentRoute && currentRoute !== 'entry' && (
          <Header setCleanChat={setCleanChat} cleanChat={cleanChat} />
        )}

        <StatusBar backgroundColor="black" style="light" />

        <View style={styles.content}>
          <Stack.Navigator initialRouteName={appState.isAuth == true ? "home" : "entry"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="entry" component={Entry} />
            <Stack.Screen
              name="home"
              children={() => (
                <ChatScreen cleanChat={cleanChat} setCleanChat={setCleanChat} />
              )}
            />
            <Stack.Screen name="myprofile" component={Profile} />
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="passage" component={Passage} />
            <Stack.Screen name="listpassage" component={ListPassage} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../pages/SplashScreen";
import LoginScreen from "../pages/Login";
import TabNavigator from "./TabNavigator";
import EquiposScreen from "../pages/Equipos";
import TipoEquipoScreen from "../components/TipoEquipo";
import FormGeneral from "../pages/FormGeneral";
import AnswersScreen from "../pages/Answers";
import ProfileScreen from "../pages/Profile";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Equipos" component={EquiposScreen} />
            <Stack.Screen
                name="TipoEquipo"
                component={TipoEquipoScreen}
                options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="FormGeneral" component={FormGeneral} />
            <Stack.Screen name="Preguntas" component={AnswersScreen} />
            <Stack.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{ presentation: "modal", headerShown: false }}
            />
        </Stack.Navigator>
    );
}

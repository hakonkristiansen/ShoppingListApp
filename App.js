import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import { AppProvider, useAppStore } from './store';
import ShoppingListScreen from './screens/ShoppingListScreen';
import InventoryScreen from './screens/InventoryScreen';

const Tab = createBottomTabNavigator();

function LangToggle() {
  const { language, toggleLanguage } = useAppStore();
  return (
    <TouchableOpacity onPress={toggleLanguage} style={{ marginRight: 16 }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
        {language === 'en' ? 'NO' : 'EN'}
      </Text>
    </TouchableOpacity>
  );
}

function Tabs() {
  const { language } = useAppStore();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#aaa',
        headerStyle: { backgroundColor: '#2D6A4F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => <LangToggle />,
      }}
    >
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          title: language === 'en' ? 'Shopping List' : 'Handleliste',
          tabBarLabel: language === 'en' ? 'Shopping List' : 'Handleliste',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: language === 'en' ? 'Inventory' : 'Beholdning',
          tabBarLabel: language === 'en' ? 'Inventory' : 'Beholdning',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </AppProvider>
  );
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Pressable } from 'react-native';
import { AppProvider, useAppStore } from './store';
import { strings } from './strings';
import ShoppingListScreen from './screens/ShoppingListScreen';
import InventoryScreen from './screens/InventoryScreen';

const Tab = createBottomTabNavigator();

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'no', label: 'NO', name: 'Norsk' },
  { code: 'sv', label: 'SV', name: 'Svenska' },
  { code: 'da', label: 'DA', name: 'Dansk' },
];

function LanguageMenu() {
  const { language, changeLanguage } = useAppStore();
  const [open, setOpen] = React.useState(false);
  const current = LANGUAGES.find(item => item.code === language) ?? LANGUAGES[0];

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.langButton}>
        <Text style={styles.langButtonText}>{current.label}</Text>
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.menuContainer}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                style={[
                  styles.menuItem,
                  language === lang.code && styles.menuItemActive,
                ]}
              >
                <Text style={[
                  styles.menuItemText,
                  language === lang.code && styles.menuItemTextActive,
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function Tabs() {
  const { language } = useAppStore();
  const titles = strings[language];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#aaa',
        headerStyle: { backgroundColor: '#2D6A4F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => <LanguageMenu />,
      }}
    >
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          title: titles.shoppingList,
          tabBarLabel: titles.shoppingList,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: titles.inventory,
          tabBarLabel: titles.inventory,
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

const styles = StyleSheet.create({
  langButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  langButtonText: {
    color: '#2D6A4F',
    fontWeight: '700',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 150,
    paddingVertical: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemActive: {
    backgroundColor: '#ecfdf5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#222',
  },
  menuItemTextActive: {
    color: '#166534',
    fontWeight: '700',
  },
});
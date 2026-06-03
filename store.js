import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const CATEGORIES = ['Fridge', 'Freezer', 'Pantry'];

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('no');
  const [inventory, setInventory] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save inventory whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory, isLoaded]);

  // Save shopping list whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }
  }, [shoppingList, isLoaded]);

  async function loadData() {
    try {
      const [inventoryData, shoppingData] = await Promise.all([
        AsyncStorage.getItem('inventory'),
        AsyncStorage.getItem('shoppingList'),
      ]);
      if (inventoryData) setInventory(JSON.parse(inventoryData));
      if (shoppingData) setShoppingList(JSON.parse(shoppingData));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  function addInventoryItem(name, category) {
    setInventory(prev => [...prev, { id: Date.now().toString(), name, category, quantity: 1 }]);
  }

  function removeInventoryItem(id) {
    setInventory(prev => prev.filter(item => item.id !== id));
  }

  function updateInventoryItem(id, name, category) {
    setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, name, category } : item))
    );
  }

  // delta is +1 or -1. Removes item if quantity hits 0.
  function changeQuantity(id, delta) {
    setInventory(prev =>
      prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    );
  }

  function addShoppingItem(name) {
    setShoppingList(prev => [...prev, { id: Date.now().toString(), name, checked: false }]);
  }

  function removeShoppingItem(id) {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  }

  function toggleShoppingItem(id) {
    setShoppingList(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }

  function toggleLanguage() {
    setLanguage(prev => prev === 'en' ? 'no' : 'en');
  }

  function clearCheckedItems() {
    setShoppingList(prev => prev.filter(item => !item.checked));
  }

  return (
    <AppContext.Provider value={{
      language, toggleLanguage,
      inventory, shoppingList,
      addInventoryItem, removeInventoryItem, updateInventoryItem, changeQuantity,
      addShoppingItem, removeShoppingItem, toggleShoppingItem, clearCheckedItems,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppContext);
}
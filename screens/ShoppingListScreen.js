import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { strings } from '../strings';

export default function ShoppingListScreen() {
  const { shoppingList, addShoppingItem, removeShoppingItem, toggleShoppingItem, clearCheckedItems, language } = useAppStore();
  const t = strings[language];
  const [inputText, setInputText] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd() {
    const name = inputText.trim();
    if (!name || isAdding) return;
    setIsAdding(true);
    addShoppingItem(name);
    setInputText('');
    setTimeout(() => setIsAdding(false), 100);
  }

  function handleClearChecked() {
    clearCheckedItems();
    setConfirmingClear(false);
  }

  const checkedCount = shoppingList.filter(i => i.checked).length;

  function renderItem({ item }) {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => toggleShoppingItem(item.id)} style={styles.checkRow}>
          <Ionicons
            name={item.checked ? 'checkbox' : 'square-outline'}
            size={24}
            color={item.checked ? '#2D6A4F' : '#555'}
          />
          <Text style={[styles.itemText, item.checked && styles.itemChecked]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeShoppingItem(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t.addItem}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={isAdding}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t.noItems}</Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={
          checkedCount > 0 ? (
            confirmingClear ? (
              <View style={styles.confirmRow}>
                <Text style={styles.confirmText}>{t.removeChecked(checkedCount)}</Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity style={styles.confirmCancel} onPress={() => setConfirmingClear(false)}>
                    <Text style={styles.confirmCancelText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmClear} onPress={handleClearChecked}>
                    <Text style={styles.confirmClearText}>{t.clear}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.clearButton} onPress={() => setConfirmingClear(true)}>
                <Text style={styles.clearButtonText}>{t.clearChecked(checkedCount)}</Text>
              </TouchableOpacity>
            )
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  addButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  list: { padding: 12, paddingBottom: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  itemText: { fontSize: 16, color: '#222' },
  itemChecked: { textDecorationLine: 'line-through', color: '#aaa' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  clearButton: {
    marginTop: 16, padding: 12, backgroundColor: '#fee2e2',
    borderRadius: 8, alignItems: 'center',
  },
  clearButtonText: { color: '#dc2626', fontWeight: '600' },
  confirmRow: {
    marginTop: 16, padding: 14, backgroundColor: '#fee2e2',
    borderRadius: 8, gap: 10,
  },
  confirmText: { color: '#dc2626', fontWeight: '600', textAlign: 'center' },
  confirmButtons: { flexDirection: 'row', gap: 8 },
  confirmCancel: {
    flex: 1, padding: 10, borderRadius: 8,
    backgroundColor: '#fff', alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd',
  },
  confirmCancelText: { color: '#666', fontWeight: '600' },
  confirmClear: {
    flex: 1, padding: 10, borderRadius: 8,
    backgroundColor: '#dc2626', alignItems: 'center',
  },
  confirmClearText: { color: '#fff', fontWeight: '700' },
});
import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, CATEGORIES } from '../store';
import { strings } from '../strings';

const CATEGORY_COLORS = {
  Fridge:  { bg: '#e0f2fe', text: '#0369a1' },
  Freezer: { bg: '#ede9fe', text: '#6d28d9' },
  Pantry:  { bg: '#fef9c3', text: '#a16207' },
};

export default function InventoryScreen() {
  const { inventory, addInventoryItem, removeInventoryItem, updateInventoryItem, changeQuantity, language } = useAppStore();
  const t = strings[language];
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputCategory, setInputCategory] = useState(CATEGORIES[0]);
  const [updatingId, setUpdatingId] = useState(null);

  function openAdd() {
    setEditingItem(null);
    setInputName('');
    setInputCategory(CATEGORIES[0]);
    setSheetVisible(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setInputName(item.name);
    setInputCategory(item.category);
    setSheetVisible(true);
  }

  function handleSave() {
    const name = inputName.trim();
    if (!name) return;
    if (editingItem) {
      updateInventoryItem(editingItem.id, name, inputCategory);
    } else {
      addInventoryItem(name, inputCategory);
    }
    setSheetVisible(false);
  }

  function renderItem({ item }) {
    const colors = CATEGORY_COLORS[item.category];
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => openEdit(item)}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
        <View style={styles.itemRight}>
          <View style={styles.quantityRow}>
            <TouchableOpacity 
              style={styles.qtyButton} 
              onPress={() => {
                setUpdatingId(item.id);
                changeQuantity(item.id, -1);
                setTimeout(() => setUpdatingId(null), 100);
              }}
              disabled={updatingId === item.id}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyButton} 
              onPress={() => {
                setUpdatingId(item.id);
                changeQuantity(item.id, 1);
                setTimeout(() => setUpdatingId(null), 100);
              }}
              disabled={updatingId === item.id}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.bg }]}>
            <Text style={[styles.tagText, { color: colors.text }]}>{t.categories[item.category]}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inventory}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t.noInventory}</Text>
        }
        ListHeaderComponent={
          <View style={styles.legend}>
            {CATEGORIES.map(cat => {
              const colors = CATEGORY_COLORS[cat];
              const count = inventory.filter(i => i.category === cat).length;
              return (
                <View key={cat} style={[styles.legendItem, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.legendText, { color: colors.text }]}>
                    {t.categories[cat]} · {count}
                  </Text>
                </View>
              );
            })}
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Overlay + sheet rendered inline, no Modal */}
      {sheetVisible && (
        <View style={styles.overlay}>
          {/* Tapping the backdrop dismisses */}
          <TouchableOpacity style={styles.backdrop} onPress={() => setSheetVisible(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{editingItem ? t.editItemTitle : t.addItemTitle}</Text>

              <TextInput
                style={styles.sheetInput}
                placeholder={t.itemName}
                value={inputName}
                onChangeText={setInputName}
                autoFocus
              />

              <Text style={styles.sheetLabel}>{t.category}</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map(cat => {
                  const colors = CATEGORY_COLORS[cat];
                  const selected = inputCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setInputCategory(cat)}
                      style={[
                        styles.categoryChip,
                        { backgroundColor: colors.bg },
                        selected && { borderColor: '#2D6A4F' },
                      ]}
                    >
                      <Text style={[styles.categoryChipText, { color: colors.text }]}>{t.categories[cat]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.sheetButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setSheetVisible(false)}>
                  <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>{t.save}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  list: { padding: 12, paddingBottom: 80 },
  legend: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  legendItem: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  legendText: { fontSize: 12, fontWeight: '600' },
  item: {
    flex: 1, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingLeft: 14, paddingRight: 30, borderRadius: 10, 
  },
  itemName: { fontSize: 16, color: '#222',  paddingVertical: 16},
  itemRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: 140, marginRight: 12,  paddingVertical: 16 },
  tag: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '600' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  qtyButton: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  qtyText: { fontSize: 15, fontWeight: '600', minWidth: 20, textAlign: 'center', color: '#222' },
  qtyButtonText: { fontSize: 16, color: '#555', userSelect: 'none', includeFontPadding: false },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#2D6A4F', width: 58, height: 58,
    borderRadius: 29, justifyContent: 'center', alignItems: 'center',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', elevation: 6,
  },
  // Inline sheet
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    backdropFilter: 'blur(2px)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 14,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  sheetInput: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#fafafa',
  },
  sheetLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  categoryRow: { flexDirection: 'row', gap: 10 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 2, borderColor: 'transparent',
  },
  categoryChipText: { fontWeight: '600', fontSize: 14 },
  sheetButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelButton: {
    flex: 1, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  saveButton: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#2D6A4F', alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700' },
});
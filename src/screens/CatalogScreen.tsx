import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { CatalogHeader } from '../components/CatalogHeader';
import { EmptyState } from '../components/EmptyState';
import { EquipmentCard } from '../components/EquipmentCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { AppStackParamList } from '../navigation/types';
import { getAvailability } from '../services/loanRules';
import type { Equipment } from '../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Catalog'>;

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export default function CatalogScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { equipments, loans, isLoading, loadError } = useData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  // En cas de succès, la stack bascule seule : pas de navigate, pas de setState.
  async function handleLogout() {
    setLogoutError(null);
    setIsLoggingOut(true);
    const result = await logout();
    if (!result.ok) {
      setLogoutError(result.message);
      setIsLoggingOut(false);
    }
  }

  function renderItem({ item }: { item: Equipment }) {
    return (
      <EquipmentCard
        equipment={item}
        availability={getAvailability(item, loans)}
        onPress={(eq) => navigation.navigate('EquipmentDetail', { equipmentId: eq.id })}
      />
    );
  }

  let content;
  if (isLoading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Chargement…</Text>
      </View>
    );
  } else if (loadError) {
    content = <EmptyState message={loadError} />;
  } else {
    content = (
      <>
        <PrimaryButton label="+ Ajouter" onPress={() => navigation.navigate('EquipmentForm', {})} />
        <FlatList
          style={styles.list}
          data={equipments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={
            <EmptyState message="Aucun équipement ne correspond à votre recherche." />
          }
          contentContainerStyle={styles.listContent}
        />
      </>
    );
  }

  return (
    <ScreenContainer>
      <CatalogHeader
        firstName={user?.firstName ?? ''}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      {logoutError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {logoutError}
        </Text>
      ) : null}
      {content}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 12,
    textAlign: 'center',
  },
  error: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B91C1C',
  },
  list: {
    marginTop: 12,
  },
  listContent: {
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
});

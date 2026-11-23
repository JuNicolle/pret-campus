import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import CatalogScreen from '../screens/CatalogScreen';
import EquipmentDetailScreen from '../screens/EquipmentDetailScreen';
import EquipmentFormScreen from '../screens/EquipmentFormScreen';
import LoanFormScreen from '../screens/LoanFormScreen';
import { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Choisit la stack selon la session : quand `user` change, l'ancienne stack
// est démontée et l'autre s'affiche, sans appel à navigate().
export function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Évite d'afficher l'écran de connexion à un utilisateur déjà connecté.
  if (isLoading) {
    return (
      // Pas d'en-tête sur cet écran : on protège aussi le haut.
      <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Chargement…</Text>
      </ScreenContainer>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppStack.Navigator initialRouteName="Catalog">
          <AppStack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalogue' }} />
          <AppStack.Screen
            name="EquipmentDetail"
            component={EquipmentDetailScreen}
            options={{ title: 'Fiche équipement' }}
          />
          <AppStack.Screen name="EquipmentForm" component={EquipmentFormScreen} options={{ title: 'Équipement' }} />
          <AppStack.Screen name="LoanForm" component={LoanFormScreen} options={{ title: 'Nouveau prêt' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Auth" component={AuthScreen} options={{ title: 'Connexion' }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 12,
    textAlign: 'center',
  },
});

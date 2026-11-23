export type Category = 'Ordinateur' | 'Casque' | 'Appareil photo' | 'Tablette' | 'Accessoire';
export type Condition = 'Bon état' | 'Usé' | 'Hors service';
export type Availability = 'Disponible' | 'Prêté' | 'Indisponible';

// Profil local unique, aucun mot de passe
export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Equipment {
  id: string; // UUID généré par l'app
  name: string; // obligatoire
  category: Category;
  description?: string; // facultatif
  condition: Condition;
  createdAt: string; // ISO
}

export interface Loan {
  id: string;
  equipmentId: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  startDate: string; // YYYY-MM-DD, date du jour
  expectedReturnDate: string; // YYYY-MM-DD, >= startDate
  returnedAt?: string; // absent = prêt en cours
}

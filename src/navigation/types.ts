// Routes de chaque stack. Les paramètres sont des identifiants uniquement :
// les données se relisent depuis le Context.
export type AuthStackParamList = {
  Auth: undefined;
};

export type AppStackParamList = {
  Catalog: undefined;
  EquipmentDetail: { equipmentId: string };
  // Sans paramètre = ajout ; avec equipmentId = modification.
  EquipmentForm: { equipmentId?: string };
  LoanForm: { equipmentId: string };
};

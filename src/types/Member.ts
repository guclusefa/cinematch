export interface Member {
  id?: string;
  pseudo?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  passwordHash?: string;
  films_aimes?: number;
  films_adores?: number;
  films_detestes?: number;
  __v?: number;
} 
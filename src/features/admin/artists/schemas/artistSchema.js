// src/features/admin/artists/schemas/artistSchema.js
import { z } from 'zod';

// Schéma de validation pour un lien social individuel
const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, { message: "Le nom de la plateforme est requis." }),
  url: z.string().trim().url({ message: "L'URL du lien social est invalide." })
});

// Schéma de validation pour le formulaire Artiste (version complète)
export const artistSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Le nom de l'artiste est requis." })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères." }),
  bio: z.string()
    .trim()
    .max(1000, { message: "La biographie ne peut pas dépasser 1000 caractères." })
    .optional()
    .or(z.literal('')), // Permet une chaîne vide ou undefined
  artistImageUrl: z.string()
    .trim()
    .url({ message: "L'URL de l'image de l'artiste est invalide." })
    .optional()
    .or(z.literal('')),
  websiteUrl: z.string()
    .trim()
    .url({ message: "L'URL du site web de l'artiste est invalide." })
    .optional()
    .or(z.literal('')),
  socialLinks: z.array(socialLinkSchema)
    .max(10, { message: "Vous ne pouvez pas ajouter plus de 10 liens sociaux."}) // Exemple de limite
    .optional()
});

// Si vous utilisez TypeScript :
// export type ArtistFormData = z.infer<typeof artistSchema>;
// export type SocialLinkData = z.infer<typeof socialLinkSchema>;

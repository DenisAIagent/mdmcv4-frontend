import { z } from 'zod';

// Schéma de validation pour un lien social individuel
const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, { message: "La plateforme est requise." }),
  url: z.string().trim().url({ message: "URL invalide." })
});

// Schéma de validation pour le formulaire Artiste
export const artistSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Le nom de l'artiste est requis." })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères." }),
  bio: z.string()
    .trim()
    .max(1000, { message: "La biographie ne peut pas dépasser 1000 caractères." })
    .optional()
    .or(z.literal('')), // Permet une chaîne vide
  artistImageUrl: z.string()
    .trim()
    .url({ message: "URL d'image invalide." })
    .optional()
    .or(z.literal('')), // Permet une chaîne vide
  websiteUrl: z.string()
    .trim()
    .url({ message: "URL de site web invalide." })
    .optional()
    .or(z.literal('')), // Permet une chaîne vide
  socialLinks: z.array(socialLinkSchema)
    .optional()
});

// Type TypeScript dérivé du schéma (si vous utilisez TypeScript)
// export type ArtistFormData = z.infer<typeof artistSchema>;


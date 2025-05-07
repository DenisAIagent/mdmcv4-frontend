import { z } from 'zod';

export const artistSchema = z.object({
    name: z.string().min(1, "Le nom de l'artiste est requis"),
    bio: z.string().optional(),
    artistImageUrl: z.string().url("L'URL de l'image doit être valide").optional().or(z.literal('')),
    websiteUrl: z.string().url("L'URL du site web doit être valide").optional().or(z.literal('')),
    socialLinks: z.array(z.object({
        platform: z.string().min(1, "La plateforme est requise"),
        url: z.string().url("L'URL doit être valide")
    })).optional().default([])
}); 
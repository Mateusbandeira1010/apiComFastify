import zod from "zod";

// Schema para criação de hotkey
export const hotkeySchema = zod.object({
  nome: zod
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres."),
  codigo: zod
    .string()
    .min(2, "O código da hotkey deve ter pelo menos 2 caracteres."),
});

// Schema para atualização de hotkey (todos os campos opcionais)
export const hotkeyUpdateSchema = zod.object({
  nome: zod
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .optional(),
  codigo: zod
    .string()
    .min(2, "O código da hotkey deve ter pelo menos 2 caracteres.")
    .optional(),
});

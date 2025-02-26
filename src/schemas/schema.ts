import zod from "zod";



    export const ninjasSchema = zod.object({
        nome: zod.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
        rank: zod.string().min(1, "Rank não pode ser vazio"),

    });

    export const ninjasUpdateSchema = zod.object({
        nome: zod.string().min(2, "Nome deve ter no mínimo 2 caracteres").optional(),
        rank: zod.string().min(1, "Rank não pode ser vazio").optional(),

    });
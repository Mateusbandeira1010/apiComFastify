import { FastifyInstance } from 'fastify';
import db from "../models/database";
import { hotkeySchema, hotkeyUpdateSchema } from "../schemas/schema";

export async function routes(fastify: FastifyInstance) {

    // Criar uma nova hotkey
    fastify.post('/apihotkeys', async (req, reply) => {
        const validate = hotkeySchema.safeParse(req.body);
        if (!validate.success) {
            return reply.status(400).send({ message: "Dados inválidos", errors: validate.error.format() });
        }

        const { nome, codigo } = validate.data;
        try {
            const stmt = db.prepare("INSERT INTO apihtk (nome, codigo) VALUES (?, ?)");
            const info = stmt.run(nome, codigo);

            return reply.status(201).send({ id: info.lastInsertRowid, nome, codigo });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ message: "Erro ao criar hotkey" });
        }
    });

    // Listar todas as hotkeys
    fastify.get('/apihotkeys', async (_, reply) => {
        const hotkeys = db.prepare("SELECT * FROM apihtk").all();
        reply.send(hotkeys);
    });

    // Buscar hotkey por ID
    fastify.get('/apihotkeys/:id', async (req, reply) => {
        const { id } = req.params as { id: string };
        const hotkey = db.prepare("SELECT * FROM apihtk WHERE id = ?").get(id);

        if (!hotkey) return reply.status(404).send({ message: "Hotkey não encontrada" });
        reply.send(hotkey);
    });

    // Atualizar hotkey
    fastify.put('/apihotkeys/:id', async (req, reply) => {
        const validate = hotkeyUpdateSchema.safeParse(req.body);
        if (!validate.success) {
            return reply.status(400).send({ message: "Dados inválidos", errors: validate.error.format() });
        }

        const { nome, codigo } = validate.data;
        const { id } = req.params as { id: string };

        try {
            const stmt = db.prepare("UPDATE apihtk SET nome = ?, codigo = ? WHERE id = ?");
            const result = stmt.run(nome, codigo, id);

            if (result.changes === 0) return reply.status(404).send({ message: "Hotkey não encontrada" });
            reply.send({ message: "Hotkey atualizada com sucesso", id, nome, codigo });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ message: "Erro ao atualizar hotkey" });
        }
    });

    // Deletar hotkey
    fastify.delete('/apihotkeys/:id', async (req, reply) => {
        const { id } = req.params as { id: string };
        const result = db.prepare("DELETE FROM apihtk WHERE id = ?").run(id);

        if (result.changes === 0) return reply.status(404).send({ message: "Hotkey não encontrada" });
        reply.send({ message: "Hotkey deletada com sucesso" });
    });

    // Buscar hotkey por nome
    fastify.get('/apihotkeys/nome/:nome', async (req, reply) => {
        const { nome } = req.params as { nome: string };
        const stmt = db.prepare("SELECT * FROM apihtk WHERE nome = ?");
        const hotkeys = stmt.all(nome);

        if (hotkeys.length === 0) return reply.status(404).send({ message: "Nenhuma hotkey encontrada com esse nome" });
        reply.send(hotkeys);
    });
}

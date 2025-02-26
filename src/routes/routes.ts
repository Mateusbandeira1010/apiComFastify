import { FastifyInstance } from 'fastify';
import db from "../models/database";
import { ninjasSchema, ninjasUpdateSchema } from '../schemas/schema';

export async function routes(fastify: FastifyInstance) {


    fastify.post('/ninjas', async (req, reply) => {
        const validateSchema = ninjasSchema.safeParse(req.body);

        if (!validateSchema.success) {
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: validateSchema.error.format(),
            });
        }

        const { nome, rank } = validateSchema.data;

        try {
            const stmt = db.prepare("INSERT INTO ninjas (nome, rank) VALUES (?, ?)");
            const info = stmt.run(nome, rank);

            return reply.status(201).send({
                message: "Ninja criado com sucesso",
                id: info.lastInsertRowid,
                nome,
                rank,
            });

        } catch (error) {
            console.error('Erro ao criar o ninja:', error);
            return reply.status(500).send({ message: "Erro interno no servidor" });
        }
    });


    fastify.get('/ninjas', async (req, reply) => {
        const stmt = db.prepare("SELECT * FROM ninjas");
        const ninjas = stmt.all();

        if (ninjas.length === 0) {
            return reply.status(404).send({ message: "Nenhum ninja foi encontrado" });
        }

        reply.send(ninjas);
    });

    // Buscar Ninja por ID
    fastify.get('/ninjas/:id', async (req, reply) => {
        const { id } = req.params as { id: string };

        const stmt = db.prepare("SELECT * FROM ninjas WHERE id = ?");
        const ninja = stmt.get(id);

        if (!ninja) {
            return reply.status(404).send({ message: 'Ninja não encontrado' });
        }

        reply.send(ninja);
    });


    fastify.put('/ninjas/:id', async (req, reply) => {
        const validateSchema = ninjasUpdateSchema.safeParse(req.body);

        if (!validateSchema.success) {
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: validateSchema.error.format(),
            });
        }

        const { nome, rank } = validateSchema.data;
        const { id } = req.params as { id: string };

        try {
            const stmt = db.prepare("UPDATE ninjas SET nome = ?, rank = ? WHERE id = ?");
            const result = stmt.run(nome, rank, id);

            if (result.changes === 0) {
                return reply.status(404).send({ message: "Ninja não encontrado" });
            }

            return reply.status(200).send({ message: "Ninja atualizado com sucesso", id, nome, rank });

        } catch (error) {
            console.error('Erro ao atualizar o ninja:', error);
            return reply.status(500).send({ message: "Erro interno no servidor" });
        }
    });

    // Deletar Ninja
    fastify.delete('/ninjas/:id', async (req, reply) => {
        const { id } = req.params as { id: string };

        try {
            const stmt = db.prepare("DELETE FROM ninjas WHERE id = ?");
            const result = stmt.run(id);

            if (result.changes === 0) {
                return reply.status(404).send({ message: "Ninja não encontrado" });
            }

            reply.send({ message: "Ninja deletado com sucesso" });

        } catch (error) {
            console.error('Erro ao deletar o ninja:', error);
            return reply.status(500).send({ message: "Erro interno no servidor" });
        }
    });


    fastify.get('/ninjas/rank/:rank', async (req, reply) => {
        const { rank } = req.params as { rank: string };
        const stmt = db.prepare("SELECT * FROM ninjas WHERE rank = ?");
        const ninjas = stmt.all(rank);

        if (ninjas.length === 0) {
            return reply.status(404).send({ message: "Nenhum ninja encontrado com esse ranks" });
        }

        reply.send(ninjas);
    });
}

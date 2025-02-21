import {FastifyInstance} from 'fastify';
import db from "./database";


export async function routes(fastify: FastifyInstance) {


    fastify.post('/ninjas', async (req, reply) => {
        const {nome, rank} = req.body as {nome: string, rank: string};
        const stmt = db.prepare("INSERT INTO ninjas (nome, rank) VALUES (?, ?)");
        const info = stmt.run(nome, rank);
        reply.send({id: info.lastInsertRowid, nome, rank});
    });


    fastify.get('/ninjas', async (req, reply) => {
        const stmt = db.prepare("SELECT * FROM ninjas");
        const ninjas = stmt.all()
        reply.send(ninjas);
    });

    fastify.get('/ninjas/:id', (req , reply) => {
        const { id } = req.params as { id: string};
        const stmt = db.prepare("SELECT * FROM ninjas WHERE id = ?")
        const ninjas = stmt.get(id);
        if(!ninjas) return reply.status(404).send({message: 'Ninja não encontrado'});
        reply.send(ninjas);
    });

    fastify.put('/ninjas', (req, reply) => {
        const { id } = req.params as {id: string}
        const {nome, rank} = req.params as {nome: string, rank: string}
        const stmt = db.prepare("UPDATE ninjas SET nome = ?, rank = ? WHERE id = ?");
        stmt.run(nome, rank, id);
        reply.send({id, nome, rank});
    })


    fastify.delete('/ninjas/:id', (req, reply) => {

        const {id} = req.params as {id: string}
        const stmt = db.prepare("DELETE FROM ninjas WHERE id = ?");
        stmt.run(id);
        reply.send({message: "Ninja Deletado com sucesso"});
    });


    fastify.get('/ninjas/rank/:rank', (req, reply) => {
        const {rank} = req.params as {rank: string}
        const stmt = db.prepare("SELECT * FROM ninjas WHERE rank = ?");
        const ninjas = stmt.all(rank);

        if(ninjas.length === 0){
            return reply.status(201).send({message: "Busca por esse ninja não foi encontrado"});
        
        }

        reply.send(ninjas);
    });
}


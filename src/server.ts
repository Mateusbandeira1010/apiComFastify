import Fastify from "fastify";
import { routes } from "./routes";
import "dotenv/config";

const fastify = Fastify({ logger: true });

fastify.register(require('@fastify/formbody'));


fastify.register(routes);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const address = await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};


start();

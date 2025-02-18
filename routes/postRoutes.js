async function postRoutes(fastify, options) {
    const collection = fastify.mongo.db.collection('Posts')

    const postBodyJsonSchema = {
        type: 'object',
        required: ['title', 'author', 'content'],
        properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            date: { type: 'date-time' }, 
            content: { type: 'string' },

        }
    }

    const postSchema = {
        body: postBodyJsonSchema,
    }

    fastify.post('/add/post', postSchema, async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        await request.jwtVerify()


        let { title, author, content } = request.body;
        let date = new Date();
        if (title.length === 0 || author.length === 0 || content.length === 0) {
            return { message: "fälten 'title' 'author' och 'content' får inte lämnas tomma" }
        }

        const result = await collection.insertOne({ title, author, content, date })
        return result
    })


    // körs innan schema validering
  fastify.addHook('preValidation', convertBody);

  // middelware för att konvertera body i formatet string till ett object
  function convertBody(request, reply, next) {
    if (typeof request.body === "string") {
      request.body = JSON.parse(request.body);
    }
    next();
  }
}
module.exports = postRoutes;


async function loginRoutes(fastify, options) {
    const bcrypt = require('bcryptjs');
    const users = fastify.mongo.db.collection('Users')

    fastify.post('/login', async (request, reply) => {
      reply.header("Access-Control-Allow-Origin", "*");
      const { username, password } = request.body;
      if (!username || !password) {
        return { message: "användarnamn/lösenord saknas" }
      }
      
      //hämtar user
      const user = await users.find({ username: username }).toArray();

      if (user[0] != undefined) { //om user finns kollas lösenord

        if (await bcrypt.compare(password, user[0].password)) {
          const token = fastify.jwt.sign({ payload: "data" }, { expiresIn: '1h' })
          return { token: token, user: user[0], loggedIn: true}

        } else {
          return { message: "användarnamn och lösenord matchar ej", loggedIn: false}
        }
      } else {
        return { message: "användarnamn och lösenord matchar ej", loggedIn: false }
      }
  
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
module.exports = loginRoutes;
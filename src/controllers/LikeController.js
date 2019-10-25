const Dev = require('../models/Dev');


module.exports = 
{
    async store(request, response) 
    {
        console.log(request.params.devId); // parametros da rota
        console.log(request.headers.user); //  quem está dando o like

        const { devId } = request.params;
        const { user } = request.headers;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) 
        {
            return response.status(400).json({error: 'Dev not exist'})
        }

        console.log(targetDev.likes.includes(targetDev["_id"]))

        if (targetDev.likes.includes(loggedDev["_id"])) 
        {
            const loggedSocket = request.connectedUser[user];
            const targetSocket = request.connectedUser[devId];

            if (loggedSocket)
            {
                // aviasndo o usuario logado que ele deu match
                request.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) 
            {
                request.io.to(targetSocket).emit('match', loggedDev);
            }

            console.log('MATCHING', loggedDev, 'WITH', targetDev);
        }

        loggedDev.likes.push(targetDev["_id"]);

        await loggedDev.save();
        
        return response.json(loggedDev)

    }
}
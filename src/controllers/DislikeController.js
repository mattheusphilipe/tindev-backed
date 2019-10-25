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

        if (loggedDev && loggedDev.dislikes)
        {
            loggedDev.dislikes.push(targetDev["_id"]);
        }
        else 
        {
            console.error(loggedDev)
            return response.json("Erro Dislikes loggedDev")
        }

    

        await loggedDev.save();
        
        return response.json(loggedDev)

    }
}
const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = 
{
    async index(request, response) 
    {
        const { user } = request.headers;

        const loggedDev = await Dev.findById(user);


        const users = await Dev.find(
            {
                $and: 
                [
                    {_id: { $ne: user }},
                    {_id: { $nin: loggedDev.likes }},
                    {_id: { $nin: loggedDev.dislikes }}
                ],
            }
        );

        return response.json(users);
    },

    async store (request, response) 
    {   const { username } =  request.body;
        console.log(username);
        const userAlreadyExist = await Dev.findOne({user: username});

        const resp = await axios.get(`https://api.github.com/users/${username}`)
        .then(
            async (e) => 
            {
                console.log(e.status)

                const {name, bio, avatar_url: avatar } = e.data;

                if (userAlreadyExist) 
                {
                    return response.json(userAlreadyExist);
                }

                if (e.status === 200) 
                {
                    const dev =  await Dev.create
                        (
                                {
                                    name, user: username, bio, avatar
                                }
                        );    
                    return dev;

                } else     
                {
                    console.warn(e.status); 
                    return e;
                }
        }
    ).catch(e => console.error(e));

        return response.json(resp);
    }
}
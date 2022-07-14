import { db } from '../dbStrategy/mongo.js'
import joi from 'joi';


export async function polls (req, res){
    
    const poll = req.body;
    
    const pollSchema = joi.object({
        title: joi.string().required(),
        expireAt: joi.date()
    });

    const { error } = pollSchema.validate(poll);

    if (error){
        return res.sendStatus(422);
    }

    if (!poll.expireAt){
        const d = new Date();
        d.setDate(d.getDate() + 30);
        poll.expireAt = d;
    }

    await db.collection('polls').insertOne(poll);

    res.sendStatus(201);

}
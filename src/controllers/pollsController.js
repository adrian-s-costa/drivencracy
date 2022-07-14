import { db, objectId } from '../dbStrategy/mongo.js'
import joi from 'joi';


export async function postPolls (req, res){
    
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

    return res.sendStatus(201);

}

export async function getPolls (req, res){
    const polls = await db.collection('polls').find({expireAt: {$exists:true}}).toArray();
    return res.send(polls)
}

export async function postChoice (req, res){
    const choice = req.body;

    const choiceSchema = joi.object({
        title: joi.string().required(),
        pollId: joi.string()
    });

    const { error } = choiceSchema.validate(choice);

    if (error){
        return res.sendStatus(422);
    }

    const choiceCheck = await db.collection('polls').findOne({_id: new objectId(choice.pollId)});

    if(!choiceCheck){
        return res.sendStatus(404);
    }

    const choiceNameCheck = await db.collection('polls').findOne({pollId: new objectId(choice.pollId), title: choice.title});

    if(choiceNameCheck){
        return res.sendStatus(409);
    }

    const choiceExpirationCheck = await db.collection('polls').findOne({_id: new objectId(choice.pollId)});
    
    const d = new Date();

    if ((choiceExpirationCheck.expireAt - d) < 0){
        return res.sendStatus(403);
    }

    await db.collection('polls').insertOne({title: choice.title, pollId: objectId(choice.pollId)});

    return res.sendStatus(201);

}

export async function getPollChoice (req, res){

    const pollsOptions = await db.collection('polls').findOne({pollId: objectId(req.params.id)});

    if(!pollsOptions){
        return res.sendStatus(404);
    }

    const pollsOptionsMulti = await db.collection('polls').find({pollId: objectId(req.params.id)}).toArray();

   return res.send(pollsOptionsMulti);
}

export async function postChoiceVote(req, res){

    const choiceCheck = await db.collection('polls').findOne({pollId: objectId(req.params.id)});

    if(!choiceCheck){
        return res.sendStatus(404);
    }

    console.log(choiceCheck)

    const pollCheckExpiration = await db.collection('polls').findOne({_id: objectId(choiceCheck.pollId)});

    const d = new Date();

    if ((pollCheckExpiration.expireAt - d) < 0){
        return res.sendStatus(403);
    }

    const choiceCheckArray = await db.collection('polls').findOne({pollId: objectId(req.params.id)});

    await db.collection('polls').insertOne({createdAt: new Date(), choiceId: objectId(choiceCheckArray._id)});

    return res.sendStatus(201);
}
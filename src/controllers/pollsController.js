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

    const choiceCheck = await db.collection('polls').findOne({ _id : objectId(req.params.id) });

    if(!choiceCheck){
        return res.sendStatus(404);
    }

    console.log(choiceCheck)

    const pollCheckExpiration = await db.collection('polls').findOne({_id: objectId(choiceCheck.pollId)});

    const d = new Date();

    if ((pollCheckExpiration.expireAt - d) < 0){
        return res.sendStatus(403);
    }

    await db.collection('polls').insertOne({createdAt: new Date(), choiceId: objectId(req.params.id)});

    return res.sendStatus(201);
}

export async function getPollResult(req, res){
    
    const checkPoll = await db.collection('polls').findOne({_id: objectId (req.params.id)});

    if(!checkPoll){
        return res.sendStatus(404);
    }
    
    const opcoesVoto = await db.collection('polls').find({pollId: objectId (req.params.id)}).toArray();

    let arrVotos = [];
    let votes = 0

    for (let i = 0; i < opcoesVoto.length; i++){
        votes = await db.collection('polls').find({choiceId: objectId(opcoesVoto[i]._id)}).count();
        arrVotos.push(votes);
    }

    const maxVotes = Math.max(...arrVotos);
    let resultArr = [];

    for (let i = 0; i < arrVotos.length; i++){
        votes = await db.collection('polls').find({choiceId: objectId(opcoesVoto[i]._id)}).count();
        console.log(votes)
        console.log(maxVotes)
        if(votes == maxVotes){
            resultArr = opcoesVoto[i];
            console.log(resultArr)
        }
        
    }

    const poll = await db.collection('polls').find({ _id : objectId(req.params.id) }).toArray();

    res.send({
        _id: req.params.id,
        title: poll[0].title,
        expireAt: poll[0].expireAt,
        result:{
            title: resultArr.title,
            votes: maxVotes
        }
    })

}
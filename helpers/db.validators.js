//Validaciones en relación a la BD

import Admin from '../src/admin/admin.model.js'
import { isValidObjectId } from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await Admin.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const findUser = async (adminId) => {
    return await Admin.findById(adminId);
};

export const ObjectIdValid = async(objectId)=>{
    if(!isValidObjectId(objectId)){
        throw new Error(`keeper is not objectId valid`)
    }
}


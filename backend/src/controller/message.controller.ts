import { json, Request, Response } from "express";
import prisma from "../db/prisma";

export const sendMessage = async (req:Request, res:Response)=>{
    try{
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user.id;

        // converation between ME And Others
        let converation = await prisma.conversation.findFirst({
            where :{
                participantIds :{
                    hasEvery : [senderId, receiverId],
                }
            }
        });
        // the very first message is being sent, that's why we need to creates a new conversation
        if(!converation){
            converation = await prisma.conversation.create({
                data:{
                    participantIds : {
                        set : [senderId , receiverId]
                    }
                }
            })
        }

        const newMessage   = await prisma.messages.create({
            data : {
                senderId,
                body : message,
                conversationId : converation.id
            }
        }); 


        if(newMessage){
                converation = await prisma.conversation.update({
                    where :{
                        id:converation.id,
                    },
                    data :{
                        message : {
                            connect : {
                                id : newMessage.id,
                            },
                        },
                    },
                }); 
        }

        // Socket io will go here

        res.status(201).json(newMessage);

    }catch(error:any){
        console.log("Error in sendMessage:",error.message);
        res.status(500).json({error : "Internal server error"})
    };
    
};


export const getMessages = async (req:Request, res:Response)=>{
    try{
        const {id:userToChatId} = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where :{
                participantIds : {
                    hasEvery : [senderId,userToChatId]
                }
            },
            include : {
                message : {
                    orderBy : {
                        createdAt : "asc"
                    }
                }
            }
        })

        if(!conversation){
            return res.status(200).json([]);
        }

    }catch(error:any){
        console.log("Error in getMessage:", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}


export const getUserForSidebar = async (req:Request, res:Response)=>{
    try{
        const authUserId = req.user.id;

        const users = await prisma.user.findMany({
            where :{
                id:{
                    not : authUserId,
                },
            },
            select : {
                id : true,
                fullName : true,
                profilePic : true,
            }
        });
        res.status(200).json(users);
    }catch (error : any){
        console.log("Error in getUsersForSidebars:", error.message);
        res.status(500).json({error : "Internal server error"});
    }

}
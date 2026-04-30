import { Request, Response } from "express";
import { database } from "../data";
import { CFriends } from "../models/friends";



export const createFriendsController = (friends: CFriends) => ({

    async sendFriendRequest(req: Request, res: Response) {
        if(!req.body) { res.status(400).json({message: "no body found"}); return }

        const addressee_id = req.body.user as string;
        const requester = (req as any).user;
    
        if (!addressee_id) { res.status(400).json({ message: "user required" }); return; }
        if(!requester) { res.status(401).json({ message: "not connected"}); return; } 
        if(!requester.userId) { res.status(401).json({ message: "No userId found"}); return }
        
        const requester_id = requester.userId;

        if(requester_id == addressee_id) { res.status(409).json("You can't be friend with yourself") }

        try {
            await friends.createFriendRequest(requester_id, addressee_id);
            return res.status(201).json({message: "Friend request sended"})
        } catch (e: any) {
            return res.status(500).json({message: "error while sending the request"})
        }
    },
    
    acceptFriendRequest(req: Request, res: Response) {
        const requester_id = req.body.user as string;
    
        if (!requester_id) {
            res.status(400).json({ message: "name required" });
            return;
        }
    
        const addressee = (req as any).user;
        const addressee_id = addressee?.userId;
    
        friends.acceptFriendRequest(requester_id, addressee_id)
    
        res.json({"message": "Friend request accepted"})
    },
    
    async getFriends(req: Request, res: Response) {
    
        const user = (req as any).user;
        const user_id = user?.userId;
    
        let friend = await friends.getFriends(user_id)
        res.json(friend)
    },
    
    async getIncomingFriendRequest(req: Request, res: Response) {
        
        const user = (req as any).user;
        const user_id = user?.userId;
    
        let incoming = await friends.getIncoming(user_id)
    
        res.json(incoming)
    },
    
    async getPendingFriendRequest(req: Request, res: Response) {
        
        const user = (req as any).user;
        const user_id = user?.userId;
    
        let pending = await friends.getPending(user_id)
    
        res.json(pending)
    },
    
    async denyIncomingFriendRequest(req: Request, res: Response) {
        const requester_id = req.body.user as string;
    
        if (!requester_id) {
            res.status(400).json({ message: "name required" });
            return;
        }
    
        const addressee = (req as any).user;
        const addressee_id = addressee?.userId;
    
        friends.denyFriendRequest(requester_id, addressee_id)
    
        res.json({"message": "Friend request denied"})
    },
    
    async deleteFriendFromUser(req: Request, res: Response) {
        const requester_id = req.body.user as string;
    
            if (!requester_id) {
            res.status(400).json({ message: "name required" });
            return;
        }
    
        const addressee = (req as any).user;
        const addressee_id = addressee?.userId;
    
        friends.deleteFriend(requester_id, addressee_id)
    
        res.json({"message": "User removed from friends"})
    } 
})

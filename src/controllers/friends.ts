import { Request, Response } from "express";
import { database } from "../data";
import { CFriends } from "../models/friends";



export const createFriendsController = (friends: CFriends) => ({

    sendFriendRequest(req: Request, res: Response) {
        const addressee_id = req.body.user as string;
    
        if (!addressee_id) {
            res.status(400).json({ message: "name required" });
            return;
        }
    
        const requester = (req as any).user;
        const requester_id = requester?.userId;
    
        friends.createFriendRequest(requester_id, addressee_id);
    
        res.json({"message": "Friend request sended"})
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

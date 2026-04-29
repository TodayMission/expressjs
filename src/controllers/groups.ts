import { Request, Response } from "express";
import { CGroups } from "../models/groups";
import { database } from "../data";

export const createGroupsController = (groups: CGroups) => ({
  
  groupCreate(req: Request, res: Response) {
    const name: string = req.body.name as string;
  
    if (!name) {
      res.status(400).json({ message: "name required" });
      return;
    }
  
    const user = (req as any).user;
    const creatorId = user?.userId;
  
    if (!creatorId) {
      res.status(401).json({ message: "missing userId in token" });
      return;
    }
  
    try {
      const groupId = groups.create(name, String(creatorId));
      res.status(201).json({ message: `group ${name} created`, name, groupId });
    } catch (error) {
      res.status(500).json({ message: "error creating group" });
    }
  },
  
  async getMyGroups(req: Request, res: Response) {
    const user = (req as any).user;
    if(!user) { res.status(401).json("Not authenticated"); return;}
    const userId = user?.userId;

  
    let _groups = await groups.getUserGroups(userId)
    
    res.status(200).json(_groups[0])
  },
  
  async sendGroupRequest(req: Request, res: Response) {
  
    const groupId = req.body.groupId
    const userId = req.body.user
    
    if(!groupId || !userId) { res.status(400).json("Not authenticated"); return}

    try{
      await groups.sendGroupRequest(groupId, userId)
      return res.status(200).json({'message': 'Group request sended successfuly'})
    } catch (e: any) {
      return res.status(500).json({message: "an error occurred"})
    }
    
  },
  
  async acceptGroupRequest(req: Request, res: Response) {
    const user = (req as any).user;
    const userId = user?.userId;
  
    if(!user) { res.status(401).json({message: "not authenticated"}); return }
    const groupId = req.body.groupId
  
    try {
      await groups.acceptGroupRequest(groupId, userId)
      return res.status(200).json({'message': 'Group request accepted successfuly'})
    } catch (e: any) {
      return res.status(500).json({message: "an error occurred"})
    }
    
  },
  
  async denyGroupRequest(req: Request, res: Response) {
    const user = (req as any).user;
    const userId = user?.userId;
  
    const groupId = req.body.groupId
  
    await groups.denyGroupRequest(groupId, userId)
    
    return res.status(200).json({'message': 'Group request accepted successfuly'})
  },
  
  async getPendingGroupRequest(req: Request, res : Response){
    const user = (req as any).user;
    const userId = user?.userId;

    if(!user) { res.status(401).json("no authenticated"); return; }
  
    let _groups = await groups.getUserPendingGroups(userId)
    
    res.status(200).send(_groups[0])
  }

})
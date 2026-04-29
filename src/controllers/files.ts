import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { Files } from "../models/files"; 
import { database } from "../data";

const files: Files = new Files(new database)

export async function uploadFile(req: Request, res: Response) {
  let userId = req.body.userId as string
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  let temp_path = "uploads/tmp/" + req.file.filename 
  let path = "uploads/" + req.file.filename 

  try{
    await files.upload(userId, req.file.filename, "uploads/" + req.file.filename)
    fs.rename(temp_path, path)
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (error) {
    fs.unlink(temp_path)
    res.status(400).json({error: "can't upload the file"})
  }
}

export async function deleteFile(req: Request, res: Response){
  let id = req.body.id as string

  try {
    let result = await files.get(id)

    await files.deleteWithId(id)
    fs.unlink(result[0][0].path)
  } catch (error) {
    return res.status(400).json({error: "error while deleting"})
  }
  
  res.json({message: "attachment deleted"})
}

export async function getFile(req: Request, res: Response) {
  let id = req.query["id"] as string
  let result

  try {
    result = await files.get(id)
  }  catch (error) {
    return res.status(400).json({error: "error while deleting"})
  }
  
  res.json({message: result})
}
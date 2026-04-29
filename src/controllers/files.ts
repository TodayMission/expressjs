import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { Files } from "../models/files"; 
import { database } from "../data";
import { CChallenges } from "../models/challenges"

const files: Files = new Files(new database)
const challenges = new CChallenges(new database())

export async function uploadFile(req: Request, res: Response) {

  const userId = req.query["userId"] as string
  const challengeId = req.params.id

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  console.log("FILE UPLOADED:")
  console.log("Original name:", req.file.originalname)
  console.log("Filename:", req.file.filename)
  console.log("Mime type:", req.file.mimetype)
  console.log("Size:", req.file.size) 

  const tempPath = "uploads/tmp/" + req.file.filename
  const finalPath = "uploads/" + req.file.filename

  try {
    await fs.rename(tempPath, finalPath)
    await files.upload(
      userId,
      challengeId,
      req.file.filename,
      finalPath
    )
    await challenges.complete(challengeId, userId)
    const isDone = await challenges.isFullyCompleted(challengeId)
    if (isDone) {
      await challenges.markChallengeAsCompleted(challengeId)
    }
    return res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      challengeCompleted: isDone
    })
  } catch (error) {
    
    console.error(" UPLOAD ERROR:", error)

    try {
      await fs.unlink(tempPath)
    } catch {}

    return res.status(500).json({
      error: "upload failed"
    })
  }
}

export async function deleteFile(req: Request, res: Response){
  let id = req.query["id"] as string

  try {
    let result = await files.get(id)

    await files.deleteWithId(id)
    const file = result?.[0]?.[0]
    if (!file) {
      return res.status(404).json({ error: "file not found" })
    }
    await fs.unlink(file.path)
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
import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { Files } from "../models/files"; 
import { database } from "../data";
import { CChallenges } from "../models/challenges"
import path from "path"

const files: Files = new Files(new database())
const challenges = new CChallenges(new database())

export async function uploadFile(req: Request, res: Response) {

  const userId = req.query["userId"] as string
  const challengeId = req.params.id

  if (!req.file) {
    console.log("NO FILE RECEIVED")
    return res.status(400).json({ error: "No file uploaded" })
  }

  console.log("FILE RECEIVED")
  console.log("Original name:", req.file.originalname)
  console.log("Filename:", req.file.filename)
  console.log("Size:", req.file.size)

  const extension = path.extname(req.file.originalname) || ".bin"

  const finalFilename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}${extension}`
  const tempPath = "uploads/tmp/" + req.file.filename
  const finalPath = "uploads/" + finalFilename

  console.log("REQ FILE:", req.file)
console.log("ORIGINAL NAME:", req.file.originalname)

  try {

    await fs.rename(tempPath, finalPath)
    console.log("FILE MOVED:", finalPath)

    await files.upload(
      userId,
      challengeId,
      req.file.originalname,
      finalPath
    )
    console.log("FILE SAVED IN DB")
    console.log("Original name:", req.file.originalname)
    console.log("Saved filename:", finalFilename)

    await challenges.complete(challengeId, userId)
    console.log("USER MARKED COMPLETED")

    const isDone = await challenges.isFullyCompleted(challengeId)
    console.log("CHALLENGE FULLY COMPLETED:", isDone)

    if (isDone) {
      await challenges.markChallengeAsCompleted(challengeId)
      console.log("CHALLENGE MARKED AS FINISHED")
    } else {
      console.log("CHALLENGE STILL IN PROGRESS")
    }

    return res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      challengeCompleted: isDone
    })

  } catch (error) {

    console.error("UPLOAD ERROR:", error)

    try {
      await fs.unlink(tempPath)
      console.log("TEMP FILE CLEANED")
    } catch {}

    return res.status(500).json({
      error: "upload failed"
    })
  }
}

export async function deleteFile(req: Request, res: Response){
  let id = req.body.id as string

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
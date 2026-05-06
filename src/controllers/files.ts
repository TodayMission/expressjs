import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { Files } from "../models/files"; 
import { database } from "../data";
import { CChallenges } from "../models/challenges"
import { CGroups } from "../models/groups"
import path from "path"

const files: Files = new Files(new database())
const challenges = new CChallenges(new database())
const groups = new CGroups(new database())

export async function uploadFile(req: Request, res: Response) {

  const userId = (req as any)?.user.userId
  const challengeId = req.params.id

  if (!req.file) {
    console.log("NO FILE RECEIVED")
    return res.status(400).json({ error: "No file uploaded" })
  }

  console.log("FILE RECEIVED")

  const extension = path.extname(req.file.originalname) || ".bin"

  const finalFilename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}${extension}`
  //Creating temporary file before adding them to the database 
  const tempPath = "uploads/tmp/" + req.file.filename
  const finalPath = "uploads/" + finalFilename

  try {
    //Adding the file in database
    await fs.rename(tempPath, finalPath)
    console.log("FILE MOVED:", finalPath)

    await files.upload(
      userId,
      challengeId,
      req.file.originalname,
      finalPath
    )
    console.log("FILE SAVED IN DB")
    

    // mark user as completed for this challenge
await challenges.complete(challengeId, userId)

// retrieve challenge data
const challengeData = await challenges.getById(challengeId)
const groupId = challengeData.group_id

// send message with proof to the group
await groups.sendMessage(
  groupId,
  userId,
  "a envoyé une preuve pour le challenge 📸",
  finalPath
)

// check if all participants have completed the challenge
const isDone = await challenges.isFullyCompleted(challengeId)

if (isDone) {
  // mark challenge as fully completed
  await challenges.markChallengeAsCompleted(challengeId)

  // notify group that the challenge is finished
  await groups.sendMessage(
    groupId,
    userId,
    "🎉 Challenge terminé par tout le monde !"
  )
}

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
  
  res.json(result[0])
}
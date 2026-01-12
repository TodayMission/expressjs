import express from "express";
import multer, { StorageEngine } from "multer";
require('dotenv').config();

import { userLogin } from "./controllers/auth";
import { requireAuth } from "./middlewares/auth";
import { groupCreate } from "./controllers/groups";
import { challengeCreate, challengeGetAll, challengeJoin, challengeLeave, challengeCancel, challengeCompleted, requireUserId, RequireChallengeId, RequireToCreateChallenge} from "./controllers/challenges"
import { deleteFile, getFile, uploadFile } from "./controllers/files";


const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tmp/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello Express + TypeScript 🚀" });
});


//**
// UPLOAD
//  */
app.post('/upload', requireUserId, upload.single('file'), uploadFile);
app.get('/upload', getFile)
app.delete('/upload/delete', deleteFile)

//**
// CHALLENGES
//  */

app.post("/challenges/create/", RequireToCreateChallenge, challengeCreate)
app.get("/challenges/", challengeGetAll)
app.post("/challenges/join/", requireUserId ,RequireChallengeId, challengeJoin)
app.delete("/challenges/leave/", requireUserId ,RequireChallengeId, challengeLeave)
app.delete("/challenges/cancel/", RequireChallengeId, challengeCancel)
app.post("/challenges/complete", requireUserId ,RequireChallengeId,challengeCompleted)



//**
// AUTH
// */

app.post("/auth/login/", userLogin);


//**
// GROUPS
// */


app.post("/groups/create/", requireAuth, groupCreate);

export default app
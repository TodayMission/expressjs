import express from "express";
import multer, { StorageEngine } from "multer";
require('dotenv').config();

import { userLogin } from "./controllers/auth";
import { requireAuth } from "./middlewares/auth";
import { acceptGroupRequest, denyGroupRequest, getMyGroups, getPendingGroupRequest, groupCreate, sendGroupRequest } from "./controllers/groups";
import { challengeCreate, challengeGetAll, challengeJoin, challengeLeave, challengeCancel, challengeCompleted, requireUserId, RequireChallengeId, RequireToCreateChallenge} from "./controllers/challenges"
import { deleteFile, getFile, uploadFile } from "./controllers/files";
import { createFriendsController } from "./controllers/friends";
import { database } from "./data";
import { CFriends } from "./models/friends";


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

app.post("/challenges/create/", requireAuth, RequireToCreateChallenge, challengeCreate)
app.get("/challenges/", challengeGetAll)
app.post("/challenges/join/", requireAuth, requireUserId ,RequireChallengeId, challengeJoin)
app.delete("/challenges/leave/", requireAuth, requireUserId ,RequireChallengeId, challengeLeave)
app.delete("/challenges/cancel/", requireAuth, RequireChallengeId, challengeCancel)
app.post("/challenges/complete", requireAuth, requireUserId ,RequireChallengeId,challengeCompleted)



//**
// AUTH
// */

app.post("/auth/login/", userLogin);


//**
// GROUPS
// */


app.post("/groups/create/", requireAuth, groupCreate);
app.get("/me/groups", requireAuth, getMyGroups);
app.post("/groups/send", requireAuth, sendGroupRequest)
app.post("/groups/accept", requireAuth, acceptGroupRequest)
app.post("/groups/deny", requireAuth, denyGroupRequest)
app.get("/me/groups_request", requireAuth, getPendingGroupRequest)


/**
 * FRIENDS
 */
var cfriend = new CFriends(new database)
var FriendController = createFriendsController(cfriend)

app.post("/friends/send", requireAuth, FriendController.sendFriendRequest)
app.post("/friends/accept", requireAuth, FriendController.acceptFriendRequest)
app.get("/me/friends", requireAuth, FriendController.getFriends)
app.get("/me/incoming_friend", requireAuth, FriendController.getIncomingFriendRequest)
app.get("/me/pending_friend", requireAuth, FriendController.getPendingFriendRequest)
app.delete("/friends/delete", requireAuth, FriendController.deleteFriendFromUser)
app.delete("/friends/deny", requireAuth, FriendController.denyIncomingFriendRequest)


export default app
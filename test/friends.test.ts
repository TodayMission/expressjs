import { createFriendsController } from "../src/controllers/friends";


describe("Friends Controller", () => {
  let mockFriends: any;
  let controller: any;

  beforeEach(() => {
    mockFriends = {
      createFriendRequest: jest.fn(),
      getFriends: jest.fn()
    };

    controller = createFriendsController(mockFriends);
  });

  it("should send friend request", async () => {
    const req: any = {
      body: { user: "user2" },
      user: { userId: "test" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest)
      .toHaveBeenCalledWith("test", "user2");

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "Friend request sended"
    });
  });

  it("should return 400 if missing body", async () => {
    const req: any = { user: {userId: "user1"} };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest).not.toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "no body found"
    });
    expect(res.json).not.toHaveBeenCalledWith({
        message: "Friend request sended"
    });
  });

  
  it("should return 400 if missing user", async () => {
    const req: any = { user: {userId: "user1"}, body: {} };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest).not.toHaveBeenCalledTimes(1);


    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "user required"
    });
    expect(res.json).not.toHaveBeenCalledWith({
        message: "Friend request sended"
    });
  });

    it("should return 401 if not connected", async () => {
    const req: any = { body: {user: "user1"} };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest).not.toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
        message: "not connected"
    });
    expect(res.json).not.toHaveBeenCalledWith({
        message: "Friend request sended"
    });
  });

  it("should return 401 if userId not found", async () => {
    const req: any = { body: {user: "user1"}, user : {} };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest).not.toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
        message: "No userId found"
    });
    expect(res.json).not.toHaveBeenCalledWith({
        message: "Friend request sended"
    });
  });

  it("Error while storing the request", async () => {
    const req: any = { body : {user : "user1"}, user : {userId: "user2"}}

    const res: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    mockFriends.createFriendRequest.mockRejectedValue(
        new Error("DB error")
    )

    await controller.sendFriendRequest(req ,res)
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        message: "error while sending the request"
    });
    expect(res.json).not.toHaveBeenCalledWith({
        message: "Friend request sended"
    });
    })


it("should not allow sending request to self", async () => {
  const req: any = {
    body: { user: "user1" },
    user: { userId: "user1" }
  };

  const res: any = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await controller.sendFriendRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
});
});
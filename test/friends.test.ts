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

  it("should send friend request", () => {
    const req: any = {
      body: { user: "user2" },
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    controller.sendFriendRequest(req, res);

    expect(mockFriends.createFriendRequest)
      .toHaveBeenCalledWith("user1", "user2");

    expect(res.json).toHaveBeenCalledWith({
      message: "Friend request sended"
    });
  });

  it("should return 400 if missing user", () => {
    const req: any = { body: {} };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    controller.sendFriendRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
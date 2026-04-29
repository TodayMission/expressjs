import { createGroupsController } from "../src/controllers/groups";

describe("Groups Controller", () => {
  let mockGroups: any;
  let controller: any;

  beforeEach(() => {
    mockGroups = {
      create: jest.fn(),
      getUserGroups: jest.fn(),
      sendGroupRequest: jest.fn(),
      acceptGroupRequest: jest.fn(),
      denyGroupRequest: jest.fn(),
      getUserPendingGroups: jest.fn()
    };

    controller = createGroupsController(mockGroups);
  });

  // ======================
  // CREATE GROUP
  // ======================

  it("should create group", async () => {
    const req: any = {
      body: { name: "MyGroup" },
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockGroups.create.mockReturnValue("group123");

    await controller.groupCreate(req, res);

    expect(mockGroups.create).toHaveBeenCalledWith("MyGroup", "user1");
    expect(mockGroups.create).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "group MyGroup created",
      name: "MyGroup",
      groupId: "group123"
    });
  });

  it("should return 400 if missing name", async () => {
    const req: any = {
      body: {},
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.groupCreate(req, res);

    expect(mockGroups.create).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "name required"
    });
  });

  it("should return 401 if not authenticated", async () => {
    const req: any = {
      body: { name: "MyGroup" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.groupCreate(req, res);

    expect(mockGroups.create).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "missing userId in token"
    });
  });

  it("should return 500 if create fails", async () => {
    const req: any = {
      body: { name: "MyGroup" },
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockGroups.create.mockImplementation(() => {
      throw new Error("DB error");
    });

    await controller.groupCreate(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "error creating group"
    });

    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("created") })
    );
  });

  // ======================
  // GET MY GROUPS
  // ======================

  it("should return user groups", async () => {
    const req: any = {
      user: { userId: "user1" }
    };

    const res: any = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    mockGroups.getUserGroups.mockResolvedValue([[{ id: "g1" }]]);

    await controller.getMyGroups(req, res);

    expect(mockGroups.getUserGroups).toHaveBeenCalledWith("user1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "g1" }]);
  });

  it("should return 401 if not authenticated when getting groups", async () => {
    const req: any = {};

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.getMyGroups(req, res);

    expect(mockGroups.getUserGroups).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // ======================
  // SEND GROUP REQUEST
  // ======================

  it("should send group request", async () => {
    const req: any = {
      body: { groupId: "g1", user: "user2" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendGroupRequest(req, res);

    expect(mockGroups.sendGroupRequest)
      .toHaveBeenCalledWith("g1", "user2");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Group request sended successfuly"
    });
  });

  it("should return 400 if missing groupId or user", async () => {
    const req: any = {
      body: {}
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.sendGroupRequest(req, res);

    expect(mockGroups.sendGroupRequest).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 500 if sendGroupRequest fails", async () => {
    const req: any = {
      body: { groupId: "g1", user: "user2" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockGroups.sendGroupRequest.mockRejectedValue(
      new Error("DB error")
    );

    await controller.sendGroupRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ======================
  // ACCEPT GROUP REQUEST
  // ======================

  it("should accept group request", async () => {
    const req: any = {
      body: { groupId: "g1" },
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.acceptGroupRequest(req, res);

    expect(mockGroups.acceptGroupRequest)
      .toHaveBeenCalledWith("g1", "user1");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 401 if not authenticated when accepting", async () => {
    const req: any = {
      body: { groupId: "g1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.acceptGroupRequest(req, res);

    expect(mockGroups.acceptGroupRequest).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // ======================
  // DENY GROUP REQUEST
  // ======================

  it("should deny group request", async () => {
    const req: any = {
      body: { groupId: "g1" },
      user: { userId: "user1" }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await controller.denyGroupRequest(req, res);

    expect(mockGroups.denyGroupRequest)
      .toHaveBeenCalledWith("g1", "user1");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ======================
  // GET PENDING GROUPS
  // ======================

  it("should return pending groups", async () => {
    const req: any = {
      user: { userId: "user1" }
    };

    const res: any = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    mockGroups.getUserPendingGroups.mockResolvedValue([[{ id: "g1" }]]);

    await controller.getPendingGroupRequest(req, res);

    expect(mockGroups.getUserPendingGroups)
      .toHaveBeenCalledWith("user1");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ id: "g1" }]);
  });

  it("should return 401 if not authenticated when getting pending", async () => {
    const req: any = {};

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.getPendingGroupRequest(req, res);

    expect(mockGroups.getUserPendingGroups).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
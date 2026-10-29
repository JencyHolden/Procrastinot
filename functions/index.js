/**
 * Procrastinot API - Cloud Function Implementation
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const extractor = require("./extractor.js");
admin.initializeApp();

// Global options for cost control
setGlobalOptions({ maxInstances: 10 });

async function getAuthUser(req) {
  // TODO: find the token in req.headers
  // TODO: use admin.auth().verifyIdToken(token)
}

function getToken(request) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return "Authorization: " + authHeader.substring(7);
}

function setCors(response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

exports.helloWorld = onRequest((request, response) => {

  const { method, path } = request;
  logger.info(`Incoming ${method} request to ${path}`);

  setCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  // Helper parser to match path segments safely
  const segments = path.split("/").filter(Boolean);

  console.log(getToken(request));
  //response.send({ message: "Check your logs for headers" });

  // ----------------------------------------------------
  // 1. /rooms
  // ----------------------------------------------------
  if (segments.length === 1 && segments[0] === "rooms") {
    // GET /rooms
    if (method === "GET") {
      return response.status(200).json([
        {
          id: "r_123",
          name: "Algebra Hour",
          mode: "pomodoro",
          inviteCode: "AB12CD"
        },
        {
          id: "r_456",
          name: "Calculus Hour",
          mode: "pomodoro",
          inviteCode: "EF34GH"
        }
      ]);
    }

    // POST /rooms
    if (method === "POST") {
      const body = request.body || {};
      if (!body.name || !body.mode) {
        return response.status(400).json({ message: "invalid payload: name and mode are required" });
      }
      return response.status(201).json({
        id: "r_123",
        name: body.name,
        mode: body.mode,
        inviteCode: "AB12CD"
      });
    }
  }

  // ----------------------------------------------------
  // 2. /rooms/{id}
  // ----------------------------------------------------
  if (segments.length === 2 && segments[0] === "rooms") {
    // GET /rooms/{id}
    if (method === "GET") {
      const roomId = extractor(request, 2);
      return response.status(200).json({
        id: roomId,
        name: "Algebra Hour",
        mode: "pomodoro",
        inviteCode: "AB12CD"
      });
    }

    // PUT /rooms/{id}
    if (method === "PUT") {
      const body = request.body || {};
      if (!body.name || !body.mode) {
        return response.status(400).json({ message: "invalid payload: name and mode required" });
      }
      const roomId = extractor(request, 2);
      return response.status(200).json({
        id: roomId,
        name: body.name,
        mode: body.mode,
        inviteCode: "AB12CD"
      });
    }

    // DELETE /rooms/{id}
    if (method === "DELETE") {
      const roomId = extractor(request, 2);
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 3. /rooms/{id}/users
  // ----------------------------------------------------
  if (segments.length === 3 && segments[0] === "rooms" && segments[2] === "users") {
    const roomId = extractor(request, 2);

    // GET /rooms/{id}/users
    if (method === "GET") {
      return response.status(200).json([
        { id: "u_1", username: "alex_dev", displayName: "Alex" },
        { id: "u_2", username: "sam_study", displayName: "Sam" }
      ]);
    }

    // POST /rooms/{id}/users (Join Room via inviteCode)
    if (method === "POST") {
      const body = request.body || {};
      if (!body.inviteCode) {
        return response.status(400).json({ message: "inviteCode is required" });
      }
      return response.status(200).json({
        id: roomId,
        name: "Algebra Hour",
        mode: "pomodoro",
        inviteCode: body.inviteCode
      });
    }
  }

  // ----------------------------------------------------
  // 4. /rooms/{id}/users/{userId}
  // ----------------------------------------------------
  if (segments.length === 4 && segments[0] === "rooms" && segments[2] === "users") {
    const userId = extractor(request, 4);

    // GET /rooms/{id}/users/{userId}
    if (method === "GET") {
      return response.status(200).json({
        id: userId,
        username: "alex_dev",
        displayName: "Alex"
      });
    }

    // DELETE /rooms/{id}/users/{userId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 5. /rooms/{id}/restrictedUsers
  // ----------------------------------------------------
  if (segments.length === 3 && segments[0] === "rooms" && segments[2] === "restrictedUsers") {
    // GET /rooms/{id}/restrictedUsers
    if (method === "GET") {
      return response.status(200).json([]);
    }

    // POST /rooms/{id}/restrictedUsers
    if (method === "POST") {
      const body = request.body || {};
      if (!body.userId) {
        return response.status(400).json({ message: "userId is required" });
      }
      return response.status(201).json({ message: `User ${body.userId} restricted` });
    }
  }

  // ----------------------------------------------------
  // 6. /rooms/{id}/restrictedUsers/{userId}
  // ----------------------------------------------------
  if (segments.length === 4 && segments[0] === "rooms" && segments[2] === "restrictedUsers") {
    const userId = extractor(request, 4);

    // GET /rooms/{id}/restrictedUsers/{userId}
    if (method === "GET") {
      return response.status(200).json({
        id: userId,
        username: "restricted_user",
        displayName: "Restricted User"
      });
    }

    // DELETE /rooms/{id}/restrictedUsers/{userId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 7. /rooms/{id}/sessions
  // ----------------------------------------------------
  if (segments.length === 3 && segments[0] === "rooms" && segments[2] === "sessions") {
    // GET /rooms/{id}/sessions
    if (method === "GET") {
      return response.status(200).json([
        {
          id: "s_001",
          mode: "pomodoro",
          state: "running",
          startedAt: new Date().toISOString(),
          durationSec: 1500
        }
      ]);
    }

    // POST /rooms/{id}/sessions
    if (method === "POST") {
      const body = request.body || {};
      if (!body.mode || !body.durationSec) {
        return response.status(400).json({ message: "mode and durationSec are required" });
      }
      return response.status(201).json({
        id: "s_001",
        mode: body.mode,
        state: "idle",
        startedAt: null,
        durationSec: body.durationSec
      });
    }
  }

  // ----------------------------------------------------
  // 8. /rooms/{id}/sessions/{sessionId}
  // ----------------------------------------------------
  if (segments.length === 4 && segments[0] === "rooms" && segments[2] === "sessions") {
    const sessionId = extractor(request, 4);

    // GET /rooms/{id}/sessions/{sessionId}
    if (method === "GET") {
      return response.status(200).json({
        id: sessionId,
        mode: "pomodoro",
        state: "running",
        startedAt: new Date().toISOString(),
        durationSec: 1500
      });
    }

    // PUT /rooms/{id}/sessions/{sessionId}
    if (method === "PUT") {
      const body = request.body || {};
      return response.status(200).json({
        id: sessionId,
        mode: body.mode || "pomodoro",
        state: "running",
        startedAt: new Date().toISOString(),
        durationSec: body.durationSec || 1500
      });
    }

    // DELETE /rooms/{id}/sessions/{sessionId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 9. /rooms/{id}/sessions/{sessionId}/users
  // ----------------------------------------------------
  if (segments.length === 5 && segments[0] === "rooms" && segments[2] === "sessions" && segments[4] === "users") {
    const sessionId = extractor(request, 4);
    // GET /rooms/{id}/sessions/{sessionId}/users
    if (method === "GET") {
      return response.status(200).json([
        {
          user: { id: "u_1", username: "alex_dev", displayName: "Alex" },
          tasks: [
            {
              id: "t_101",
              userId: "u_1",
              title: "Complete Homework #3",
              status: "in_progress",
              progressPercent: 50,
              persistAfterSession: true,
              retentionSec: 3600
            }
          ]
        }
      ]);
    }

    // POST /rooms/{id}/sessions/{sessionId}/users
    if (method === "POST") {
      const body = request.body || {};
      if (!body.userId) {
        return response.status(400).json({ message: "userId is required" });
      }
      return response.status(201).json({ message: "User added to session" });
    }
  }

  // ----------------------------------------------------
  // 10. /rooms/{id}/sessions/{sessionId}/users/{userId}
  // ----------------------------------------------------
  if (segments.length === 6 && segments[0] === "rooms" && segments[2] === "sessions" && segments[4] === "users") {
    const userId = extractor(request, 5);

    // GET /rooms/{id}/sessions/{sessionId}/users/{userId}
    if (method === "GET") {
      return response.status(200).json({
        user: { id: userId, username: "alex_dev", displayName: "Alex" },
        tasks: []
      });
    }

    // DELETE /rooms/{id}/sessions/{sessionId}/users/{userId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 11. /rooms/{id}/sessions/{sessionId}/userTasks
  // ----------------------------------------------------
  if (segments.length === 5 && segments[0] === "rooms" && segments[2] === "sessions" && segments[4] === "userTasks") {
    const sessionId = extractor(request, 4);
    // GET /rooms/{id}/sessions/{sessionId}/userTasks
    if (method === "GET") {
      return response.status(200).json([
        {
          id: "t_101",
          userId: "u_1",
          title: "Complete Homework #3",
          status: "in_progress",
          progressPercent: 50,
          persistAfterSession: true,
          retentionSec: 3600
        }
      ]);
    }

    // POST /rooms/{id}/sessions/{sessionId}/userTasks
    if (method === "POST") {
      const body = request.body || {};
      if (!body.userId || !body.title || body.persistAfterSession === undefined || body.retentionSec === undefined) {
        return response.status(400).json({ message: "userId, title, persistAfterSession, and retentionSec are required" });
      }
      return response.status(201).json({
        id: "t_101",
        userId: body.userId,
        title: body.title,
        status: "todo",
        progressPercent: 0,
        persistAfterSession: body.persistAfterSession,
        retentionSec: body.retentionSec
      });
    }
  }

  // ----------------------------------------------------
  // 12. /rooms/{id}/sessions/{sessionId}/userTasks/{taskId}
  // ----------------------------------------------------
  if (segments.length === 6 && segments[0] === "rooms" && segments[2] === "sessions" && segments[4] === "userTasks") {
    const taskId = extractor(request, 6);

    // GET /rooms/{id}/sessions/{sessionId}/userTasks/{taskId}
    if (method === "GET") {
      return response.status(200).json({
        id: taskId,
        userId: "u_1",
        title: "Complete Homework #3",
        status: "in_progress",
        progressPercent: 50,
        persistAfterSession: true,
        retentionSec: 3600
      });
    }

    // PATCH /rooms/{id}/sessions/{sessionId}/userTasks/{taskId}
    if (method === "PATCH") {
      const body = request.body || {};
      return response.status(200).json({
        id: taskId,
        userId: "u_1",
        title: "Complete Homework #3",
        status: body.status || "in_progress",
        progressPercent: body.progressPercent !== undefined ? body.progressPercent : 75,
        persistAfterSession: true,
        retentionSec: 3600
      });
    }

    // DELETE /rooms/{id}/sessions/{sessionId}/userTasks/{taskId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 13. /users
  // ----------------------------------------------------
  if (segments.length === 1 && segments[0] === "users") {
    // GET /users
    if (method === "GET") {
      return response.status(200).json([
        { id: "u_1", username: "alex_dev", displayName: "Alex" }
      ]);
    }

    // POST /users
    if (method === "POST") {
      const body = request.body || {};
      if (!body.username || !body.displayName) {
        return response.status(400).json({ message: "username and displayName are required" });
      }
      return response.status(201).json({
        id: "u_1",
        username: body.username,
        displayName: body.displayName
      });
    }
  }

  // ----------------------------------------------------
  // 14. /users/{userId}
  // ----------------------------------------------------
  if (segments.length === 2 && segments[0] === "users") {
    const userId = extractor(request, 1);

    // GET /users/{userId}
    if (method === "GET") {
      return response.status(200).json({
        id: userId,
        username: "alex_dev",
        displayName: "Alex"
      });
    }

    // PUT /users/{userId}
    if (method === "PUT") {
      const body = request.body || {};
      return response.status(200).json({
        id: userId,
        username: body.username || "alex_dev",
        displayName: body.displayName || "Alex"
      });
    }

    // DELETE /users/{userId}
    if (method === "DELETE") {
      return response.status(204).send();
    }
  }

  // ----------------------------------------------------
  // 15. /users/{userId}/rooms
  // ----------------------------------------------------
  if (segments.length === 3 && segments[0] === "users" && segments[2] === "rooms") {
    if (method === "GET") {
      return response.status(200).json([
        {
          id: "r_123",
          name: "Algebra Hour",
          mode: "pomodoro",
          inviteCode: "AB12CD"
        }
      ]);
    }
  }

  // ----------------------------------------------------
  // 16. /users/{userId}/tasks
  // ----------------------------------------------------
  if (segments.length === 3 && segments[0] === "users" && segments[2] === "tasks") {
    if (method === "GET") {
      const userId = extractor(request, 1);
      return response.status(200).json([
        {
          id: "t_101",
          userId: userId,
          title: "Complete Homework #3",
          status: "in_progress",
          progressPercent: 50,
          persistAfterSession: true,
          retentionSec: 3600
        }
      ]);
    }
  }

  // ----------------------------------------------------
  // Fallback 404
  // ----------------------------------------------------
  return response.status(404).json({ message: "Route not found" });
});
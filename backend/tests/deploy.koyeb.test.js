const request = require("supertest");

const API_URL = "https://fluffy-orel-svdev34-1caab703.koyeb.app";

jest.setTimeout(20000); // temps max 20s car Koyeb peut être lent à sortir du sleep

describe("US15 - Déploiement backend sur Koyeb", () => {
  it("doit répondre sur /health (toujours 200)", async () => {
    const res = await request(API_URL).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });

  it("doit répondre sur /api/photos (publique)", async () => {
    const res = await request(API_URL).get("/api/photos");
    expect([200, 204]).toContain(res.status); // 200 si tableau, 204 si vide
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("doit protéger /api/auth/me (401 attendu si pas de token)", async () => {
    const res = await request(API_URL).get("/api/auth/me");
    expect([401, 403]).toContain(res.status);
  });
});

const request = require("supertest");

const DOMAIN = "https://stephaneverniere.fr"; // ton domaine OVH

describe("US18 - Sitemap", () => {
  it("doit être accessible et renvoyer du XML valide", async () => {
    const res = await request(DOMAIN).get("/sitemap.xml");
    expect([200, 304]).toContain(res.status); // 304 si cache
    expect(res.type).toMatch(/xml/); // doit être XML
    expect(res.text).toContain("<urlset");
  });

  it("doit contenir l’URL de la page d’accueil", async () => {
    const res = await request(DOMAIN).get("/sitemap.xml");
    expect(res.text).toContain("https://stephaneverniere.fr/");
  });

  it("doit contenir la page photographe", async () => {
    const res = await request(DOMAIN).get("/sitemap.xml");
    expect(res.text).toContain("https://stephaneverniere.fr/photographe");
  });

  it("doit contenir la page photobooth", async () => {
    const res = await request(DOMAIN).get("/sitemap.xml");
    expect(res.text).toContain("https://stephaneverniere.fr/photobooth");
  });

  it("doit contenir la page contact", async () => {
    const res = await request(DOMAIN).get("/sitemap.xml");
    expect(res.text).toContain("https://stephaneverniere.fr/contact");
  });
});

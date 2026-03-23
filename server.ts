import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import Database from "better-sqlite3";
import { HOSPITALS, DIVISIONS, ROLLOUT_STEPS } from "./src/constants";

async function initDatabase() {
  const dbPath = process.env.DATABASE_PATH || "./data/itrak.db";
  const dataDir = path.dirname(dbPath);

  await fs.mkdir(dataDir, { recursive: true });

  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS rollout_progress (
      hospital_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      completed_steps INTEGER DEFAULT 0,
      step_status TEXT NOT NULL,
      step_completion_dates TEXT NOT NULL,
      step_comments TEXT NOT NULL,
      step_responsible_party TEXT NOT NULL,
      current_task_index INTEGER,
      last_updated TEXT NOT NULL,
      PRIMARY KEY (hospital_id, module_id)
    )
  `);

  // Migration: add new columns to existing tables (runs on every startup, idempotent)
  const tableInfo = db.prepare("PRAGMA table_info(rollout_progress)").all() as Array<{ name: string }>;
  const columnNames = tableInfo.map((c) => c.name);
  const stepCount = ROLLOUT_STEPS.length;
  const defaultStepResponsible = JSON.stringify(Array(stepCount).fill("ITRAK Team"));

  if (!columnNames.includes("step_responsible_party")) {
    db.exec("ALTER TABLE rollout_progress ADD COLUMN step_responsible_party TEXT");
    db.prepare("UPDATE rollout_progress SET step_responsible_party = ?").run(defaultStepResponsible);
  }
  if (!columnNames.includes("current_task_index")) {
    db.exec("ALTER TABLE rollout_progress ADD COLUMN current_task_index INTEGER");
  }

  const rowCount = db.prepare("SELECT COUNT(*) as count FROM rollout_progress").get() as { count: number };
  if (rowCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO rollout_progress (hospital_id, module_id, completed_steps, step_status, step_completion_dates, step_comments, step_responsible_party, current_task_index, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const stepStatus = JSON.stringify(Array(stepCount).fill(false));
    const stepDates = JSON.stringify(Array(stepCount).fill(null));
    const stepComments = JSON.stringify(Array(stepCount).fill(""));

    for (const h of HOSPITALS) {
      insert.run(h.id, "qr-care-exp", 0, stepStatus, stepDates, stepComments, defaultStepResponsible, null, now);
    }
  }

  return db;
}

async function startServer() {
  const db = await initDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const defaultStepResponsibleForRead = JSON.stringify(Array(ROLLOUT_STEPS.length).fill("ITRAK Team"));

  app.get("/api/progress", (_req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM rollout_progress").all() as Array<{
        hospital_id: string;
        module_id: string;
        completed_steps: number;
        step_status: string;
        step_completion_dates: string;
        step_comments: string;
        step_responsible_party?: string;
        current_task_index?: number | null;
        last_updated: string;
      }>;

      const progress = rows.map((r) => ({
        hospitalId: r.hospital_id,
        moduleId: r.module_id,
        completedSteps: r.completed_steps,
        stepStatus: JSON.parse(r.step_status) as boolean[],
        stepCompletionDates: JSON.parse(r.step_completion_dates) as (string | null)[],
        stepComments: JSON.parse(r.step_comments) as string[],
        stepResponsibleParty: r.step_responsible_party != null ? (JSON.parse(r.step_responsible_party) as string[]) : JSON.parse(defaultStepResponsibleForRead) as string[],
        currentTaskIndex: r.current_task_index ?? null,
        lastUpdated: r.last_updated,
      }));

      res.json(progress);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  const upsertProgress = db.prepare(`
    INSERT INTO rollout_progress (hospital_id, module_id, completed_steps, step_status, step_completion_dates, step_comments, step_responsible_party, current_task_index, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(hospital_id, module_id) DO UPDATE SET
      completed_steps = excluded.completed_steps,
      step_status = excluded.step_status,
      step_completion_dates = excluded.step_completion_dates,
      step_comments = excluded.step_comments,
      step_responsible_party = excluded.step_responsible_party,
      current_task_index = excluded.current_task_index,
      last_updated = excluded.last_updated
  `);

  app.put("/api/progress", (req, res) => {
    try {
      const p = req.body;
      if (!p?.hospitalId || !p?.moduleId) {
        return res.status(400).json({ error: "Invalid progress body" });
      }
      upsertProgress.run(
        p.hospitalId,
        p.moduleId,
        p.completedSteps ?? 0,
        JSON.stringify(p.stepStatus ?? []),
        JSON.stringify(p.stepCompletionDates ?? []),
        JSON.stringify(p.stepComments ?? []),
        JSON.stringify(p.stepResponsibleParty ?? Array(ROLLOUT_STEPS.length).fill("ITRAK Team")),
        p.currentTaskIndex ?? null,
        p.lastUpdated ?? new Date().toISOString()
      );
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save progress" });
    }
  });

  app.put("/api/progress/bulk", (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Expected array of progress items" });
      }
      const run = db.transaction(() => {
        for (const p of items) {
          upsertProgress.run(
            p.hospitalId,
            p.moduleId,
            p.completedSteps ?? 0,
            JSON.stringify(p.stepStatus ?? []),
            JSON.stringify(p.stepCompletionDates ?? []),
            JSON.stringify(p.stepComments ?? []),
            JSON.stringify(p.stepResponsibleParty ?? Array(ROLLOUT_STEPS.length).fill("ITRAK Team")),
            p.currentTaskIndex ?? null,
            p.lastUpdated ?? new Date().toISOString()
          );
        }
      });
      run();
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save progress" });
    }
  });

  app.put("/api/progress/bulk-responsible-party", (req, res) => {
    try {
      const { stepIndex, responsibleParty, scope, divisionIds } = req.body;
      if (!responsibleParty || typeof responsibleParty !== "string") {
        return res.status(400).json({ error: "responsibleParty is required" });
      }
      const stepIdx = stepIndex != null ? Number(stepIndex) : null;
      if (stepIdx != null && (stepIdx < 0 || stepIdx >= ROLLOUT_STEPS.length)) {
        return res.status(400).json({ error: "Invalid stepIndex" });
      }
      let hospitalIds: string[];
      if (scope === "divisions" && Array.isArray(divisionIds) && divisionIds.length > 0) {
        const validDivIds = new Set(DIVISIONS.map((d) => d.id));
        const filtered = divisionIds.filter((id: string) => validDivIds.has(id));
        hospitalIds = HOSPITALS.filter((h) => filtered.includes(h.divisionId)).map((h) => h.id);
      } else {
        hospitalIds = HOSPITALS.map((h) => h.id);
      }
      const updateStepParty = db.prepare(`
        UPDATE rollout_progress SET step_responsible_party = ?, last_updated = ?
        WHERE hospital_id = ? AND module_id = 'qr-care-exp'
      `);
      const run = db.transaction(() => {
        for (const hid of hospitalIds) {
          const row = db.prepare("SELECT step_responsible_party FROM rollout_progress WHERE hospital_id = ? AND module_id = 'qr-care-exp'").get(hid) as { step_responsible_party: string } | undefined;
          if (!row) continue;
          const current = JSON.parse(row.step_responsible_party) as string[];
          const next = stepIdx != null ? [...current] : Array(ROLLOUT_STEPS.length).fill(responsibleParty);
          if (stepIdx != null) {
            next[stepIdx] = responsibleParty;
          }
          updateStepParty.run(JSON.stringify(next), new Date().toISOString(), hid);
        }
      });
      run();
      res.json({ ok: true, updated: hospitalIds.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to bulk update responsible party" });
    }
  });

  app.get("/api/source/*", async (req, res) => {
    const filename = req.params[0];
    const allowedFiles = [
      "package.json",
      "server.ts",
      "vite.config.ts",
      "tsconfig.json",
      "index.html",
      "src/App.tsx",
      "src/constants.ts",
      "src/types.ts",
      "src/main.tsx",
      "src/index.css",
    ];

    if (!allowedFiles.includes(filename)) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const filePath = path.join(process.cwd(), filename);
      const content = await fs.readFile(filePath, "utf-8");
      res.setHeader("Content-Type", "text/plain");
      res.send(content);
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import { beforeEach, describe, expect, it, vi } from "vitest";

type AnyRecord = Record<string, any>;

const { dbMock, fsMock } = vi.hoisted(() => ({
  dbMock: {
    execute: vi.fn(),
    query: vi.fn(),
    getConnection: vi.fn(),
  },
  fsMock: {
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

vi.mock("../src/config/db", () => ({
  default: dbMock,
}));

vi.mock("fs", () => ({
  default: fsMock,
}));

import { createSkpDocument, updateSkpDocument } from "../src/controllers/skpController";

function mockResponse() {
  const res: AnyRecord = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("SKP controller critical safety", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fsMock.existsSync.mockReturnValue(true);
  });

  it("does not delete old file when update fails on duplicate", async () => {
    dbMock.execute
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ id: 10, file_path: "uploads/old.pdf", uploaded_by: "staff", nama_skp: "A", triwulan: 1, tahun: 2026 }]])
      .mockResolvedValueOnce([[{ id: 99 }]]);
    dbMock.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const req: AnyRecord = {
      params: { id: "10" },
      body: { nama_skp: "Nama SKP Aman", triwulan: 1, tahun: 2026 },
      file: { filename: "new.pdf" },
    };
    const res = mockResponse();

    await updateSkpDocument(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(409);
    const deletedTargets = fsMock.unlinkSync.mock.calls.map((args) => String(args[0]));
    expect(deletedTargets.some((p) => p.includes("old.pdf"))).toBe(false);
    expect(deletedTargets.some((p) => p.includes("new.pdf"))).toBe(true);
  });

  it("rolls back transaction when history write fails on create", async () => {
    const connection = {
      beginTransaction: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      release: vi.fn(),
      execute: vi.fn().mockResolvedValueOnce([{ insertId: 77 }]),
    };

    dbMock.getConnection.mockResolvedValue(connection);
    dbMock.execute
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[]])
      .mockRejectedValueOnce(new Error("history failed"));
    dbMock.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const req: AnyRecord = {
      body: { nama_skp: "SKP Test", triwulan: 2, tahun: 2026 },
      file: { filename: "create.pdf" },
      user: { username: "admin", role: "Admin" },
    };
    const res = mockResponse();

    await createSkpDocument(req as any, res as any);

    expect(connection.rollback).toHaveBeenCalledTimes(1);
    expect(connection.commit).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("cleans uploaded file on create exception", async () => {
    dbMock.getConnection.mockRejectedValueOnce(new Error("connection failed"));
    dbMock.execute
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[]]);
    dbMock.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const req: AnyRecord = {
      body: { nama_skp: "SKP Test", triwulan: 3, tahun: 2026 },
      file: { filename: "orphan.pdf" },
      user: { username: "staff", role: "Staff" },
    };
    const res = mockResponse();

    await createSkpDocument(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    const deletedTargets = fsMock.unlinkSync.mock.calls.map((args) => String(args[0]));
    expect(deletedTargets.some((p) => p.includes("orphan.pdf"))).toBe(true);
  });
});

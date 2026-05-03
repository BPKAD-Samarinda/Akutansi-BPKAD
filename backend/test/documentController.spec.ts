import { beforeEach, describe, expect, it, vi } from "vitest";

type AnyRecord = Record<string, any>;

const { dbMock, fsMock } = vi.hoisted(() => ({
  dbMock: {
    execute: vi.fn(),
    query: vi.fn(),
  },
  fsMock: {
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
    promises: {
      unlink: vi.fn(),
    },
  },
}));

vi.mock("../src/config/db", () => ({
  default: dbMock,
}));

vi.mock("fs", () => ({
  default: fsMock,
}));

import {
  createDocument,
  deleteDocument,
  permanentlyDeleteDocumentFromHistory,
  restoreDocumentFromHistory,
} from "../src/controllers/documentController";

function mockResponse() {
  const res: AnyRecord = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("Document controller critical flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fsMock.existsSync.mockReturnValue(true);
    fsMock.promises.unlink.mockResolvedValue(undefined);
    dbMock.query.mockResolvedValue([[{ 1: 1 }]]);
  });

  it("cleans uploaded file when create gets duplicate", async () => {
    dbMock.query.mockImplementation(async (sql: string) => {
      if (sql.includes("INFORMATION_SCHEMA.COLUMNS")) return [[{ 1: 1 }]];
      return [[{ 1: 1 }]];
    });
    dbMock.execute.mockImplementation(async (sql: string) => {
      if (sql.includes("SELECT id FROM documents WHERE nama_sppd")) {
        return [[{ id: 1 }]];
      }
      return [[]];
    });
    const req: AnyRecord = {
      body: { nama_sppd: "Doc A", tanggal_sppd: "2026-01-10", kategori: "Lampiran" },
      file: { filename: "dup.pdf" },
      user: { username: "staff" },
    };
    const res = mockResponse();

    await createDocument(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(409);
    const deletedTargets = fsMock.unlinkSync.mock.calls.map((args) => String(args[0]));
    expect(deletedTargets.some((p) => p.includes("dup.pdf"))).toBe(true);
  });

  it("returns 400 when restoring non-deleted history item", async () => {
    dbMock.query.mockImplementation(async () => [[{ 1: 1 }]]);
    dbMock.execute.mockImplementation(async (sql: string) => {
      if (sql.includes("SELECT id, document_id, status FROM document_history")) {
        return [[{ id: 7, document_id: 11, status: "diedit" }]];
      }
      return [[]];
    });

    const req: AnyRecord = { params: { id: "7" } };
    const res = mockResponse();

    await restoreDocumentFromHistory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("permanently deletes file and related rows for deleted history", async () => {
    dbMock.query.mockImplementation(async () => [[{ 1: 1 }]]);
    dbMock.execute.mockImplementation(async (sql: string) => {
      if (sql.includes("SELECT id, document_id, file_path, status FROM document_history")) {
        return [[{ id: 3, document_id: 55, file_path: "uploads/file55.pdf", status: "dihapus" }]];
      }
      return [[]];
    });

    const req: AnyRecord = { params: { id: "3" } };
    const res = mockResponse();

    await permanentlyDeleteDocumentFromHistory(req as any, res as any);

    expect(fsMock.promises.unlink).toHaveBeenCalled();
    expect(dbMock.execute).toHaveBeenCalledWith(
      "DELETE FROM documents WHERE id = ? AND is_deleted = 1",
      [55],
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("soft delete marks row and inserts history", async () => {
    dbMock.query.mockImplementation(async () => [[{ 1: 1 }]]);
    dbMock.execute.mockImplementation(async (sql: string) => {
      if (sql.includes("SELECT id, is_deleted, nama_sppd, uploaded_by, file_path FROM documents")) {
        return [[{ id: 10, is_deleted: 0, nama_sppd: "Doc X", uploaded_by: "staff", file_path: "uploads/x.pdf" }]];
      }
      return [[]];
    });

    const req: AnyRecord = { params: { id: "10" } };
    const res = mockResponse();

    await deleteDocument(req as any, res as any);

    const updateCallExists = dbMock.execute.mock.calls.some(
      (args) =>
        args[0] === "UPDATE documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?" &&
        Array.isArray(args[1]) &&
        args[1][0] === "10",
    );
    expect(updateCallExists).toBe(true);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

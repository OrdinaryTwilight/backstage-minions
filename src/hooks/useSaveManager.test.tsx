/**
 * @file useSaveManager Hook Tests
 * @description Tests for save file import/export and security validation.
 * Verifies file size limits, MIME type checks, and Zod schema validation.
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the GameContext before importing the hook
const mockDispatch = vi.fn();
vi.mock("../context/GameContext", () => ({
  useGame: () => ({
    state: {
      session: null,
      progress: { prod_phantom_school: { stars: 2, completed: true } },
      unlockedStories: ["story-1"],
      contacts: ["sys_comms"],
      unreadContacts: [],
      chatHistory: {},
      hasSeenIntro: true,
    },
    dispatch: mockDispatch,
  }),
  GameSaveSchema: {
    safeParse: vi.fn((data) => ({
      success: true,
      data: {
        progress: data.progress ?? {},
        unlockedStories: data.unlockedStories ?? [],
        contacts: data.contacts ?? [],
        unreadContacts: data.unreadContacts ?? [],
        chatHistory: data.chatHistory ?? {},
        hasSeenIntro: data.hasSeenIntro ?? false,
      },
    })),
  },
  migrateIds: vi.fn((ids: string[]) => ids),
}));

import { useSaveManager } from "./useSaveManager";

/**
 * Helper to create a mock File object with specified content, name, and type.
 */
function makeFile(content: string, name: string, type: string): File {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

describe("useSaveManager", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:fake"),
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      writable: true,
    });
  });

  it("returns the expected interface", () => {
    const { result } = renderHook(() => useSaveManager());
    expect(typeof result.current.handleExportSave).toBe("function");
    expect(typeof result.current.handleImportSave).toBe("function");
    expect(result.current.fileInputRef).toBeDefined();
    expect(result.current.ioFeedback).toBeNull();
  });

  it("handleExportSave creates and revokes an object URL", async () => {
    const { result } = renderHook(() => useSaveManager());

    act(() => {
      result.current.handleExportSave();
    });

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("handleExportSave sets success feedback", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSaveManager());

    act(() => {
      result.current.handleExportSave();
    });

    expect(result.current.ioFeedback?.type).toBe("success");

    // Feedback clears after 4 seconds
    act(() => {
      vi.advanceTimersByTime(4001);
    });
    expect(result.current.ioFeedback).toBeNull();

    vi.useRealTimers();
  });

  it("handleImportSave rejects files exceeding 1MB", async () => {
    const { result } = renderHook(() => useSaveManager());
    // Simulate a file bigger than 1 MB
    const bigFile = {
      size: 2 * 1024 * 1024,
      name: "save.json",
      type: "application/json",
    };
    const fakeEvent = {
      target: { files: [bigFile], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/1MB/);
  });

  it("handleImportSave rejects files that are not JSON", async () => {
    const { result } = renderHook(() => useSaveManager());
    const nonJsonFile = makeFile("{}", "save.txt", "text/plain");
    const fakeEvent = {
      target: { files: [nonJsonFile], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/\.json/);
  });

  it("handleImportSave rejects JSON without expected root keys", async () => {
    const { result } = renderHook(() => useSaveManager());
    const file = makeFile(
      '{"someRandomKey": true}',
      "save.json",
      "application/json",
    );
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
  });

  it("handleImportSave dispatches LOAD_SAVE with valid data", async () => {
    const { result } = renderHook(() => useSaveManager());
    const validSave = JSON.stringify({
      progress: { prod_phantom_school: { stars: 3, completed: true } },
      unlockedStories: [],
      contacts: ["sys_comms"],
      unreadContacts: [],
      chatHistory: {},
      hasSeenIntro: true,
    });
    const file = makeFile(validSave, "save.json", "application/json");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "LOAD_SAVE" }),
    );
    expect(result.current.ioFeedback?.type).toBe("success");
  });

  it("handleImportSave is a no-op when no file is selected", async () => {
    const { result } = renderHook(() => useSaveManager());
    const fakeEvent = {
      target: { files: null, value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result.current.ioFeedback).toBeNull();
  });

  it("handleImportSave handles invalid JSON gracefully", async () => {
    const { result } = renderHook(() => useSaveManager());
    const file = makeFile(
      "NOT VALID JSON {{{",
      "save.json",
      "application/json",
    );
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
  });

  it("handleImportSave handles schema validation failure gracefully", async () => {
    const { GameSaveSchema } = await import("../context/GameContext");
    vi.mocked(GameSaveSchema.safeParse).mockReturnValueOnce({
      success: false,
      error: new Error("bad"),
    } as unknown as ReturnType<typeof GameSaveSchema.safeParse>);

    const { result } = renderHook(() => useSaveManager());
    const validSave = JSON.stringify({
      progress: {},
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
      chatHistory: {},
    });
    const file = makeFile(validSave, "save.json", "application/json");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/invalid|corrupted/i);
  });

  it("handleImportSave rejects files exceeding 1MB size limit", async () => {
    const { result } = renderHook(() => useSaveManager());
    // Create a file larger than MAX_FILE_SIZE_BYTES (1MB = 1_048_576 bytes)
    const largeContent = "x".repeat(1_048_577);
    const file = makeFile(largeContent, "huge.json", "application/json");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/size|limit/i);
  });

  it("handleImportSave rejects files with wrong extension AND wrong MIME type", async () => {
    const { result } = renderHook(() => useSaveManager());
    // .txt extension with text/plain MIME — neither is JSON
    const file = makeFile('{"progress":{}}', "save.txt", "text/plain");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/\.json/i);
  });

  it("handleImportSave accepts files with .json extension even if MIME is wrong", async () => {
    const { result } = renderHook(() => useSaveManager());
    // .json extension with octet-stream MIME (some systems do this) — still valid
    const validSave = JSON.stringify({
      progress: {},
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
      chatHistory: {},
    });
    const file = makeFile(validSave, "save.json", "application/octet-stream");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    // Should succeed (not rejected at mime/extension gate)
    expect(result.current.ioFeedback?.type).toBe("success");
  });

  it("handleImportSave rejects JSON with no recognized save keys", async () => {
    const { result } = renderHook(() => useSaveManager());
    // Valid JSON but no recognized save keys
    const alienJson = JSON.stringify({ foo: "bar", baz: 42 });
    const file = makeFile(alienJson, "save.json", "application/json");
    const fakeEvent = {
      target: { files: [file], value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleImportSave(fakeEvent);
    });

    expect(result.current.ioFeedback?.type).toBe("error");
    expect(result.current.ioFeedback?.msg).toMatch(/recognized/i);
  });
});

import * as slint from "npm:slint-ui@1.12.1";
import slintUi from "./keyboard_tester.slint" with { type: "text" };

interface SlintKeyEvent {
  text: string;
  key: string;
  modifiers: {
    alt: boolean;
    control: boolean;
    meta: boolean;
    shift: boolean;
  };
  repeat: boolean;
}

interface KeyboardWindow {
  tested_keys: string[];
  last_key_text: string;
  shift_held: boolean;
  ctrl_held: boolean;
  alt_held: boolean;
  key_clicked: (key: string) => void;
  physical_key_pressed: (event: SlintKeyEvent) => void;
  physical_key_released: (event: SlintKeyEvent) => void;
  run: () => Promise<void>;
  Utils: {
    contains: (a: string[], v: string) => boolean;
  };
}

if (import.meta.main) {
  const ui = slint.loadSource(slintUi, "keyboard_tester.slint");

  // deno-lint-ignore no-explicit-any
  const window = new (ui as any).MainWindow() as KeyboardWindow;

  window.Utils.contains = (arr, value) => {
    return [...arr].includes(value);
  };

  // Initialize tested keys array
  window.tested_keys = [];
  const testedKeysSet = new Set<string>();
  let unknownKeyCounter = 0;

  const handleKeyPress = (key: string) => {
    console.log(`Key tested: "${key}"`);

    // Add to tested keys if not already tested
    if (!testedKeysSet.has(key)) {
      testedKeysSet.add(key);
      window.tested_keys = Array.from(testedKeysSet);

      // Celebration for first time testing this key
      console.log(
        `✅ New key unlocked: "${key}" (Total: ${window.tested_keys.length}/47)`,
      );

      // Check if all keys are tested
      if (window.tested_keys.length >= 47) {
        console.log(
          "🎉 CONGRATULATIONS! All keys tested! Your keyboard is working perfectly! 🎉",
        );
      }
    }
  };

  // Handle key clicks from the UI (both mouse and keyboard)
  window.key_clicked = (key: string) => {
    handleKeyPress(key);
    window.last_key_text = `last key: ${key}`;
  };

  window.physical_key_pressed = (event: SlintKeyEvent) => {
    window.shift_held = event.modifiers.shift;
    window.ctrl_held = event.modifiers.control;
    window.alt_held = event.modifiers.alt;

    let key_to_process;

    switch (event.key) {
      case "Shift":
        key_to_process = "Shift";
        break;
      case "Control":
        key_to_process = "Control";
        break;
      case "Alt":
        key_to_process = "Alt";
        break;
      case "Space":
        key_to_process = "Space";
        break;
      case "Backspace":
        key_to_process = "Backspace";
        break;
      case "Tab":
        key_to_process = "Tab";
        break;
      case "Enter":
      case "Return":
        key_to_process = "Enter";
        break;
      case "CapsLock":
        key_to_process = "CapsLock";
        break;
      default:
        key_to_process = event.text;
        break;
    }

    if (key_to_process) {
      handleKeyPress(key_to_process);
      window.last_key_text = `last key: ${key_to_process}`;
    } else {
      unknownKeyCounter++;
      window.last_key_text = `last key: unknown ${unknownKeyCounter}`;
    }
  };

  window.physical_key_released = (event: SlintKeyEvent) => {
    window.shift_held = event.modifiers.shift;
    window.ctrl_held = event.modifiers.control;
    window.alt_held = event.modifiers.alt;
  };

  console.log("🚀 Keyboard Tester Started!");
  console.log("💡 Goal: Test all 47 keys to make them turn green!");
  console.log("📋 Click keys or type on your physical keyboard");
  console.log("🎯 Green keys = Tested ✅ | Gray keys = Not tested yet");

  await window.run();
}

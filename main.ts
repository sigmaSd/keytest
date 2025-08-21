import * as slint from "npm:slint-ui@1.12.1";
import slintUi from "./keyboard_tester.slint" with { type: "text" };

interface KeyboardWindow {
  tested_keys: string[];
  key_clicked: (key: string) => void;
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

  // Handle key clicks from the UI (both mouse and keyboard)
  window.key_clicked = (key: string) => {
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

  console.log("🚀 Modern Keyboard Tester Started!");
  console.log("💡 Goal: Test all 47 keys to make them turn green!");
  console.log("📋 Click keys or type on your physical keyboard");
  console.log("🎯 Green keys = Tested ✅ | Gray keys = Not tested yet");

  await window.run();
}

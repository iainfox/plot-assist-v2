import { invoke } from "@tauri-apps/api/core";
import { data_added } from "./list_data_handler";

const file_input = document.getElementById("file-input")
if (!file_input) {throw new Error("No file input found")}

file_input.addEventListener("change", async (event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        const file = input.files[0]
        if (!file.name.toLowerCase().endsWith('.csv')) {
            input.value = "";
            return;
        }

        try {
            const text = await file.text();
            const channels = await invoke<string[]>('parse_file_from_text', { fileData: text });
            data_added(channels)
        } catch (err) {
            console.error("Failed to read file or send to backend:", err);
        }
    }
});
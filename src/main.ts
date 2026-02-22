// import { invoke } from "@tauri-apps/api/core";

// let greetInputEl: HTMLInputElement | null;
// let greetMsgEl: HTMLElement | null;

// async function greet() {
//   if (greetMsgEl && greetInputEl) {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     greetMsgEl.textContent = await invoke("greet", {
//       name: greetInputEl.value,
//     });
//   }
// }

import "./available_channels";
import "./selection_utils";
import "./selected_channels";
import { select_all } from "./selection_utils";

const available_channels_list = document.getElementById("available-channels");
const selected_channels_list = document.getElementById("selected-channels");

document.addEventListener("keydown", (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && available_channels_list && selected_channels_list) {
        select_all(available_channels_list, true)
        select_all(selected_channels_list, true)
        available_channels_list.classList.remove("selected");
        selected_channels_list.classList.remove("selected");
    }
});
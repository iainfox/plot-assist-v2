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

let search_available_channels = document.getElementById("available-channels-search")
let available_channels_list = document.getElementById("available-channels")

search_available_channels?.addEventListener("input", () => { // gets a little laggy at ~5000 elements
    if (!search_available_channels || !available_channels_list) return;

    const text = (search_available_channels as HTMLInputElement).value.trim().toLowerCase();

    for (let i = 0; i < available_channels_list.children.length; i++) {
        const child = available_channels_list.children[i] as HTMLElement;
        const matches = !text || child.textContent?.toLowerCase().includes(text);
        child.style.display = matches ? "" : "none";
    }
});
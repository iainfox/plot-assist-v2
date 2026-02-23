import { invoke } from "@tauri-apps/api/core";

const available_channels_list = document.getElementById("available-channels");
const available_channels_list_warning = document.getElementById("list-warning");

const names = await invoke<string[]>("get_channels", {});

available_channels_list?.classList.remove("hidden")
available_channels_list_warning?.classList.add("hidden")
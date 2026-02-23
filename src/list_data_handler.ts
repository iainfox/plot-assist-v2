import { invoke } from "@tauri-apps/api/core";

const available_channels_list = document.getElementById("available-channels");
const available_channels_list_warning = document.getElementById("list-warning");

function add_channel(list: HTMLElement, str: string) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = "checkbox";
    input.className = "channel";
    input.id = str;

    const label = document.createElement('label');
    label.textContent = str;

    li.appendChild(input);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(label);

    list.appendChild(li);
    console.log(`Added channel: ${str}`)
}

const names = await invoke<string[]>("get_channels", {});
if (names.length != 0 && available_channels_list) {
    available_channels_list?.classList.remove("hidden");
    available_channels_list_warning?.classList.add("hidden");

    names.slice(1).forEach(str => { // skips the index column
        add_channel(available_channels_list, str);
    });
}

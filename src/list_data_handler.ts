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

function get_available(): string[] | undefined {
    if (!available_channels_list) return

    const checked_labels = Array.from(available_channels_list.querySelectorAll("input:checked + label"))
        .map((label: Element) => label.textContent || "");
    return checked_labels;
}

function get_selected(): [string, number][] | undefined {
    if (!selected_channels_list) return

    let arr: [string, number][] = [];

    Array.from(selected_channels_list.querySelectorAll("input:checked + label"))
        .map((label: Element) => {
            let name: string = label.textContent.substring(0, label.textContent.length - 4) || ""
            let group: number = Number.parseInt(label.textContent.substring(label.textContent.length - 2, label.textContent.length - 1))
            arr.push([name, group])
        });

    return arr
}

function data_added() {
    if (!available_channels_list) return
    available_channels_list?.classList.remove("hidden");
    available_channels_list_warning?.classList.add("hidden");

    names.slice(1).forEach(str => { // skips the index column
        add_channel(available_channels_list, str);
    });
}

const names = await invoke<string[]>("get_channels", {});
if (names.length != 0 && available_channels_list) {
    data_added()
}

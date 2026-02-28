import { invoke } from "@tauri-apps/api/core";

const available_channels_list = document.getElementById("available-channels");
const available_channels_list_warning = document.getElementById("list-warning");
const selected_channels_list = document.getElementById("selected-channels");

const add_all = document.getElementById("add-all")
const add_all_grouped = document.getElementById("add-all-grouped")
const add_selected = document.getElementById("add-selected")
const add_selected_grouped = document.getElementById("add-selected-grouped")
const seperate_group = document.getElementById("seperate-group")
const combine_groups = document.getElementById("combine-groups")
const move_back = document.getElementById("move-back")
const move_forward = document.getElementById("move-forward")
const remove_selected = document.getElementById("remove-selected")
const remove_all = document.getElementById("remove-all")

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

function clear_list(list: HTMLElement) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

type GroupsResponse = { groups: string[][]; selectedAfter: { groupIndex: number; channelName: string }[] };

function update_selected_from_response(resp: GroupsResponse) {
    if (!selected_channels_list) return;

    clear_list(selected_channels_list);
    for (let group_index = 0; group_index < resp.groups.length; group_index++) {
        resp.groups[group_index].forEach((channelName) => {
            add_channel(selected_channels_list, channelName + ` [${group_index}]`);
        });
    }
    const selSet = new Set(resp.selectedAfter.map((s) => `${s.groupIndex}\t${s.channelName}`));
    selected_channels_list.querySelectorAll("input.channel").forEach((input) => {
        const li = (input as HTMLInputElement).closest("li");
        const label = li?.querySelector("label");
        const text = label?.textContent?.trim() ?? "";
        const m = text.match(/^(.*)\s*\[(\d+)\]$/);
        if (m) {
            const key = `${m[2]}\t${m[1].trim()}`;
            if (selSet.has(key)) (input as HTMLInputElement).checked = true;
        }
    });
}

function get_available(): string[] | undefined {
    if (!available_channels_list) return

    const checked_labels = Array.from(available_channels_list.querySelectorAll("input:checked + label"))
        .map((label: Element) => label.textContent || "");
    return checked_labels;
}

function get_selected(): [string, number][] | undefined {
    if (!selected_channels_list) return;
    const arr: [string, number][] = [];
    Array.from(selected_channels_list.querySelectorAll("input:checked + label")).forEach((label: Element) => {
        const text = (label as HTMLElement).textContent?.trim() ?? "";
        const m = text.match(/^(.*)\s*\[(\d+)\]$/);
        if (m) arr.push([m[1].trim(), Number(m[2])]);
    });
    return arr;
}

function data_added() {
    if (!available_channels_list) return
    available_channels_list?.classList.remove("hidden");
    available_channels_list_warning?.classList.add("hidden");

    names.slice(1).forEach(str => { // skips the index column
        add_channel(available_channels_list, str);
    });
}

function selected_payload() {
    const s = get_selected();
    return (s ?? []).map(([channelName, groupIndex]) => ({ groupIndex, channelName }));
}

const names = await invoke<string[]>("get_channels", {});
if (names.length != 0 && available_channels_list) {
    data_added()
}

add_all?.addEventListener("click", async () => {
    if (!available_channels_list) return;
    const resp = await invoke<GroupsResponse>("add_channels", {
        channelNames: Array.from(available_channels_list.children).map((el) => (el as HTMLElement).textContent?.trim() || ""),
        grouped: false,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

add_all_grouped?.addEventListener("click", async () => {
    if (!available_channels_list) return;
    const resp = await invoke<GroupsResponse>("add_channels", {
        channelNames: Array.from(available_channels_list.children).map((el) => (el as HTMLElement).textContent?.trim() || ""),
        grouped: true,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

add_selected?.addEventListener("click", async () => {
    if (!available_channels_list) return;
    const resp = await invoke<GroupsResponse>("add_channels", {
        channelNames: get_available(),
        grouped: false,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

add_selected_grouped?.addEventListener("click", async () => {
    if (!available_channels_list) return;
    const resp = await invoke<GroupsResponse>("add_channels", {
        channelNames: get_available(),
        grouped: true,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

seperate_group?.addEventListener("click", async () => {
    const resp = await invoke<GroupsResponse>("", {});
    update_selected_from_response(resp);
});

combine_groups?.addEventListener("click", async () => {
    const selected = get_selected();
    if (!selected || selected.length <= 1) return;
    let group_a_idx = 0;
    let group_b_idx = 0;
    for (let i = 1; i < selected.length; i++) {
        if (selected[group_a_idx][1] !== selected[i][1]) group_b_idx = i;
    }
    if (group_a_idx === group_b_idx) return;
    const resp = await invoke<GroupsResponse>("combine", {
        groupA: selected[group_a_idx][1],
        groupB: selected[group_b_idx][1],
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

move_back?.addEventListener("click", async () => {
    const selected = get_selected();
    if (!selected || selected.length === 0) return;
    const groupIndices = [...new Set(selected.map(([, g]) => g))];
    const resp = await invoke<GroupsResponse>("move_backward_batch", {
        groupIndices,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

move_forward?.addEventListener("click", async () => {
    const selected = get_selected();
    if (!selected || selected.length === 0) return;
    const groupIndices = [...new Set(selected.map(([, g]) => g))];
    const resp = await invoke<GroupsResponse>("move_forward_batch", {
        groupIndices,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

remove_selected?.addEventListener("click", async () => {
    const selected = get_selected();
    const groupIndices: number[] = [];
    const channelNames: string[] = [];
    if (selected) {
        for (let i = 0; i < selected.length; i++) {
            groupIndices.push(selected[i][1]);
            channelNames.push(selected[i][0]);
        }
    }
    const resp = await invoke<GroupsResponse>("remove_channels", {
        groupIndices,
        channelNames,
        selected: selected_payload(),
    });
    update_selected_from_response(resp);
});

remove_all?.addEventListener("click", async () => {
    const resp = await invoke<GroupsResponse>("remove_all", {});
    update_selected_from_response(resp);
});

const plot_button = document.getElementById("plot-button");
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
let plot_window_counter = 0

plot_button?.addEventListener("click", async (_) => {
    plot_window_counter++
    const plot_window = new WebviewWindow(`plot-window-${plot_window_counter}`, {
        url: "./src/plot_window/index.html",
        title: `Plot ${plot_window_counter}`,

        x: 0,
        y: 0,
        width: 1050,
        height: 400,
    });

    plot_window.once('tauri://created', function () {
        plot_window.show()
    });

    plot_window.once('tauri://error', function (e) {
        console.log(e)
    });
});
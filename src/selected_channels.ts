import { select_all, select_range } from "./selection_utils";

const search_selected_channels = document.getElementById("selected-channels-search");
const selected_channels_list = document.getElementById("selected-channels");
const available_channels_list = document.getElementById("available-channels");

search_selected_channels?.addEventListener("input", () => { // gets a little laggy at ~5000 elements
    if (!search_selected_channels || !selected_channels_list) return;

    const text = (search_selected_channels as HTMLInputElement).value.trim().toLowerCase();

    for (let i = 0; i < selected_channels_list.children.length; i++) {
        const child = selected_channels_list.children[i] as HTMLElement;
        const matches = !text || child.textContent?.toLowerCase().includes(text);
        child.style.display = matches ? "" : "none";
    }
});

let recent_selection_sc: HTMLElement | null;
let recent_shift_selection_sc: HTMLElement | null;
let mouse_down_sc: boolean = false;

selected_channels_list?.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
    mouse_down_sc = true;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');

    if (!checkbox) return;
    if (!selected_channels_list?.children) return;

    if (e.ctrlKey) {
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            recent_selection_sc = li
            recent_shift_selection_sc = null;
        } else {
            recent_selection_sc = null
        }
    } else if (e.shiftKey) {
        mouse_down_sc = false;
        let selected = li;
        let selected_idx = Array.from(selected_channels_list.children).indexOf(li);

        if (selected === recent_selection_sc) { checkbox.checked = true; return };
        if (recent_selection_sc == null) {
            recent_selection_sc = li;
            checkbox.checked = true;
            return;
        }

        if (recent_shift_selection_sc != null) {
            let recent_shift_selection_sc_idx = Array.from(selected_channels_list.children).indexOf(recent_shift_selection_sc);
            select_range(selected_channels_list, selected_idx, recent_shift_selection_sc_idx, true);
        }
        recent_shift_selection_sc = selected;

        let recent_selection_sc_idx = Array.from(selected_channels_list.children).indexOf(recent_selection_sc);
        select_range(selected_channels_list, selected_idx, recent_selection_sc_idx)
    } else {
        select_all(selected_channels_list, true);
        checkbox.checked = true;

        recent_selection_sc = li;
        recent_shift_selection_sc = null;
    }

    e.preventDefault();
});

selected_channels_list?.addEventListener("mouseup", (_) => {
    mouse_down_sc = false;
});

selected_channels_list?.addEventListener("mouseleave", (_) => {
    mouse_down_sc = false;
});

selected_channels_list?.addEventListener("mouseover", (e) => {
    if (!mouse_down_sc) return;

    const target = e.target as HTMLElement;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');
    checkbox?.click()
});

selected_channels_list?.addEventListener("click", () => {
    if (selected_channels_list) {
        selected_channels_list.classList.add("selected");
    }
    if (available_channels_list) {
        available_channels_list.classList.remove("selected");
        select_all(available_channels_list, true)
    }
});

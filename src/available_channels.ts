import { select_all, select_range } from "./selection_utils";

const search_available_channels = document.getElementById("available-channels-search");
const available_channels_list = document.getElementById("available-channels");

search_available_channels?.addEventListener("input", () => { // gets a little laggy at ~5000 elements
    if (!search_available_channels || !available_channels_list) return;

    const text = (search_available_channels as HTMLInputElement).value.trim().toLowerCase();

    for (let i = 0; i < available_channels_list.children.length; i++) {
        const child = available_channels_list.children[i] as HTMLElement;
        const matches = !text || child.textContent?.toLowerCase().includes(text);
        child.style.display = matches ? "" : "none";
    }
});

let recent_selection_ac: HTMLElement | null;
let recent_shift_selection_ac: HTMLElement | null;
let mouse_down_ac: boolean = false;

available_channels_list?.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
    mouse_down_ac = true;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');

    if (!checkbox) return;
    if (!available_channels_list?.children) return;

    if (e.ctrlKey) {
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            recent_selection_ac = li
            recent_shift_selection_ac = null;
        } else {
            recent_selection_ac = null
        }
    } else if (e.shiftKey) {
        mouse_down_ac = false;
        let selected = li;
        let selected_idx = Array.from(available_channels_list.children).indexOf(li);

        if (selected === recent_selection_ac) { checkbox.checked = true; return };
        if (recent_selection_ac == null) {
            recent_selection_ac = li;
            checkbox.checked = true;
            return;
        }

        if (recent_shift_selection_ac != null) {
            let recent_shift_selection_ac_idx = Array.from(available_channels_list.children).indexOf(recent_shift_selection_ac);
            select_range(available_channels_list, selected_idx, recent_shift_selection_ac_idx, true);
        }
        recent_shift_selection_ac = selected;

        let recent_selection_ac_idx = Array.from(available_channels_list.children).indexOf(recent_selection_ac);
        select_range(available_channels_list, selected_idx, recent_selection_ac_idx)
    } else {
        select_all(available_channels_list, true);
        checkbox.checked = true;

        recent_selection_ac = li;
        recent_shift_selection_ac = null;
    }

    e.preventDefault();
});

available_channels_list?.addEventListener("mouseup", (_) => {
    mouse_down_ac = false;
});

available_channels_list?.addEventListener("mouseleave", (_) => {
    mouse_down_ac = false;
});

available_channels_list?.addEventListener("mouseover", (e) => {
    if (!mouse_down_ac) return;

    const target = e.target as HTMLElement;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');
    checkbox?.click()
});

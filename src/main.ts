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

function select_all(list: HTMLElement, deselect?: boolean) {
    if (!list) return;
    const checkboxes = list.querySelectorAll<HTMLInputElement>('.channel:checked');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = deselect ? false : true;
    });
}


function select_range(list: HTMLElement, a: number, b: number, deselect?: boolean): void {
    if (!list?.children) return;

    let start = Math.min(a, b);
    let end = Math.max(a, b);

    for (let i = start; i <= end; i++) {
        const currentLi = list.children[i] as HTMLElement;
        const input = currentLi.querySelector<HTMLInputElement>('.channel');
        if (input) {
            input.checked = deselect ? false : true;
        }
    }
}

let recent_slection: number = -1;
let recent_shift_slection: number = -1;
let mouse_down: boolean = false;

available_channels_list?.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
    mouse_down = true;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');

    if (!checkbox) return;
    if (!available_channels_list?.children) return;

    if (e.ctrlKey) {
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            recent_slection = Array.from(available_channels_list.children).indexOf(li)
            recent_shift_slection = -1;
        } else {
            recent_slection = -1
        }
    } else if (e.shiftKey) {
        let selected = Array.from(available_channels_list.children).indexOf(li);
        if (selected === recent_slection) { checkbox.checked = true; return };
        if (recent_slection == -1) {
            recent_slection = Array.from(available_channels_list.children).indexOf(li)
            checkbox.checked = true;
            return;
        }

        if (recent_shift_slection != -1) {
            deselect_range(selected, recent_shift_slection);
        }
        recent_shift_slection = selected;

        let start = Math.min(selected, recent_slection);
        let end = Math.max(selected, recent_slection);

        for (let i = start; i <= end; i++) {
            const currentLi = available_channels_list.children[i] as HTMLElement;
            const input = currentLi.querySelector<HTMLInputElement>('.channel');
            if (input) {
                input.checked = true;
            }
        }
    } else {
        deselect_all();
        checkbox.checked = true;

        recent_slection = Array.from(available_channels_list.children).indexOf(li)
        recent_shift_slection = -1;
    }

    e.preventDefault();
});

available_channels_list?.addEventListener("mouseup", (_) => {
    mouse_down = false;
});

available_channels_list?.addEventListener("mouseover", (e) => {
    if (!mouse_down) return;

    const target = e.target as HTMLElement;

    const li = target.closest('li');
    if (!li) return;
    const checkbox = li.querySelector<HTMLInputElement>('.channel');
    checkbox?.click()
});
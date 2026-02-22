export function select_all(list: HTMLElement, deselect?: boolean) {
    if (!list) return;
    const checkboxes = list.querySelectorAll<HTMLInputElement>('.channel:checked');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = deselect ? false : true;
    });
}

export function select_range(list: HTMLElement, a: number, b: number, deselect?: boolean): void {
    if (!list?.children) return;

    let start = Math.min(a, b);
    let end = Math.max(a, b);

    for (let i = start; i <= end; i++) {
        const currentLi = list.children[i] as HTMLElement;
        const input = currentLi.querySelector<HTMLInputElement>('.channel');
        if (input && currentLi.style.display != "none") {
            input.checked = deselect ? false : true;
        }
    }
}

let channel_length = 40
const selected_channels_list = document.getElementById("selected-channels");
const available_channels_list = document.getElementById("available-channels");

if (available_channels_list) {
    for (let i = 1; i <= channel_length; i++) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = "checkbox";
        input.className = "channel";
        input.id = String(i);

        const label = document.createElement('label');
        label.textContent = String(i);

        li.appendChild(input);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(label);

        available_channels_list.appendChild(li);
    }
}

if (selected_channels_list) {
    for (let i = 1; i <= channel_length; i++) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = "checkbox";
        input.className = "channel";
        input.id = String(i);

        const label = document.createElement('label');
        label.textContent = String(i);

        li.appendChild(input);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(label);

        selected_channels_list.appendChild(li);
    }
}
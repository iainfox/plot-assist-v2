let channel_length = 4000

if (available_channels_list) {
    for (let i = 0; i < channel_length; i++) {
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
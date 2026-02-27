// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;

mod parse_file;
use parse_file::FileData;

mod selected_channels_handler;
use selected_channels_handler::{Channel, ChannelSystem};

#[tauri::command]
fn get_channels(state: tauri::State<FileData>) -> Vec<String> {
    state.get_names().to_vec()
}

#[tauri::command]
fn get_index(state: tauri::State<FileData>) -> Vec<String> {
    state.get_index().to_vec()
}

#[tauri::command]
fn get_data(state: tauri::State<FileData>, channel: String) -> Option<Vec<f32>> {
    Some(state.get_data(&channel)?.to_vec())
}

#[tauri::command]
fn move_backward(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_index: usize,
) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    system.move_backward(group_index);
    system.get_groups()
}

#[tauri::command]
fn move_forward(state: tauri::State<Mutex<ChannelSystem>>, group_index: usize) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    system.move_forward(group_index);
    system.get_groups()
}

#[tauri::command]
fn combine(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_a: usize,
    group_b: usize,
) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    system.combine(group_a, group_b);
    system.get_groups()
}

#[tauri::command]
fn add_channels(
    state: tauri::State<Mutex<ChannelSystem>>,
    file_data: tauri::State<FileData>,
    channel_names: Vec<String>,
    grouped: bool,
) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    let mut channels: Vec<Channel> = Vec::new();
    let file_names: Vec<String> = file_data.get_names().to_vec();
    for name in channel_names {
        if !file_names.contains(&name) {
            continue;
        }
        if let Some(data) = file_data.get_data(&name) {
            let channel = Channel {
                name: name.clone(),
                data: data.to_vec(),
            };
            channels.push(channel);
        }
    }

    system.add_channels(channels, grouped);
    system.get_groups()
}

#[tauri::command]
fn remove_channels(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_indices: Vec<usize>,
    channel_names: Vec<String>,
) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    system.remove_channels(group_indices, channel_names);
    system.get_groups()
}

#[tauri::command]
fn remove_all(state: tauri::State<Mutex<ChannelSystem>>) -> Vec<Vec<String>> {
    let mut system = state.lock().unwrap();

    system.remove_all();
    system.get_groups()
}

#[tauri::command]
fn get_selected(state: tauri::State<Mutex<ChannelSystem>>) -> Vec<Vec<String>> {
    let system = state.lock().unwrap();
    system.get_groups()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(FileData::new())
        .manage(Mutex::new(ChannelSystem::new()))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_channels,
            get_index,
            get_data,
            move_backward,
            move_forward,
            combine,
            add_channels,
            remove_channels,
            remove_all,
            get_selected
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

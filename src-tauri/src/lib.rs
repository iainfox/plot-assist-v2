// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;

mod parse_file;
use parse_file::FileData;

mod selected_channels_handler;
use selected_channels_handler::{Channel, ChannelSystem};

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct SelectedItem {
    group_index: usize,
    channel_name: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct GroupsResponse {
    groups: Vec<Vec<String>>,
    selected_after: Vec<SelectedItem>,
}

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
fn move_backward_batch(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_indices: Vec<usize>,
    selected: Vec<SelectedItem>,
) -> GroupsResponse {
    let mut system = state.lock().unwrap();
    let n = system.get_groups().len();
    let mut pos: Vec<usize> = (0..n).collect();
    let mut sorted: Vec<usize> = group_indices.into_iter().collect();
    sorted.sort();
    sorted.dedup();
    for i in sorted {
        system.move_backward(i);
        if i > 0 && i < pos.len() {
            pos.swap(i, i - 1);
        }
    }
    let groups = system.get_groups();
    let selected_after: Vec<SelectedItem> = selected
        .into_iter()
        .filter_map(|s| {
            let new_gi = pos.iter().position(|&p| p == s.group_index)?;
            Some(SelectedItem {
                group_index: new_gi,
                channel_name: s.channel_name,
            })
        })
        .collect();
    GroupsResponse {
        groups,
        selected_after,
    }
}

#[tauri::command]
fn move_forward_batch(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_indices: Vec<usize>,
    selected: Vec<SelectedItem>,
) -> GroupsResponse {
    let mut system = state.lock().unwrap();
    let n = system.get_groups().len();
    let mut pos: Vec<usize> = (0..n).collect();
    let mut sorted: Vec<usize> = group_indices.into_iter().collect();
    sorted.sort_by(|a, b| b.cmp(a));
    sorted.dedup();
    for i in sorted {
        system.move_forward(i);
        if i + 1 < pos.len() {
            pos.swap(i, i + 1);
        }
    }
    let groups = system.get_groups();
    let selected_after: Vec<SelectedItem> = selected
        .into_iter()
        .filter_map(|s| {
            let new_gi = pos.iter().position(|&p| p == s.group_index)?;
            Some(SelectedItem {
                group_index: new_gi,
                channel_name: s.channel_name,
            })
        })
        .collect();
    GroupsResponse {
        groups,
        selected_after,
    }
}

#[tauri::command]
fn combine(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_a: usize,
    group_b: usize,
    selected: Vec<SelectedItem>,
) -> GroupsResponse {
    let mut system = state.lock().unwrap();
    system.combine(group_a, group_b);
    let groups = system.get_groups();
    let selected_after: Vec<SelectedItem> = selected
        .into_iter()
        .map(|s| {
            let new_gi = if s.group_index == group_b {
                group_a
            } else if s.group_index > group_b {
                s.group_index - 1
            } else {
                s.group_index
            };
            SelectedItem {
                group_index: new_gi,
                channel_name: s.channel_name,
            }
        })
        .collect();
    GroupsResponse {
        groups,
        selected_after,
    }
}

#[tauri::command]
fn add_channels(
    state: tauri::State<Mutex<ChannelSystem>>,
    file_data: tauri::State<FileData>,
    channel_names: Vec<String>,
    grouped: bool,
    selected: Vec<SelectedItem>,
) -> GroupsResponse {
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
    let groups = system.get_groups();
    GroupsResponse {
        groups,
        selected_after: selected,
    }
}

#[tauri::command]
fn remove_channels(
    state: tauri::State<Mutex<ChannelSystem>>,
    group_indices: Vec<usize>,
    channel_names: Vec<String>,
) -> GroupsResponse {
    let mut system = state.lock().unwrap();

    system.remove_channels(group_indices, channel_names);
    GroupsResponse {
        groups: system.get_groups(),
        selected_after: vec![],
    }
}

#[tauri::command]
fn remove_all(state: tauri::State<Mutex<ChannelSystem>>) -> GroupsResponse {
    let mut system = state.lock().unwrap();
    system.remove_all();
    GroupsResponse {
        groups: system.get_groups(),
        selected_after: vec![],
    }
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
            move_backward_batch,
            move_forward_batch,
            combine,
            add_channels,
            remove_channels,
            remove_all,
            get_selected
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

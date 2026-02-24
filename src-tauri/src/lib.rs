// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;

mod parse_file;
use parse_file::FileData;

mod selected_channels_handler;

#[tauri::command]
fn get_channels(state: tauri::State<Mutex<FileData>>) -> Vec<String> {
    let file_data = state.lock().unwrap();
    file_data.get_names().to_vec()
}

#[tauri::command]
fn get_index(state: tauri::State<Mutex<FileData>>) -> Vec<String> {
    let file_data = state.lock().unwrap();
    file_data.get_index().to_vec()
}

#[tauri::command]
fn get_data(state: tauri::State<Mutex<FileData>>, channel: String) -> Option<Vec<f32>> {
    let file_data = state.lock().unwrap();
    Some(file_data.get_data(&channel)?.to_vec())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(FileData::new()))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_channels, get_index, get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

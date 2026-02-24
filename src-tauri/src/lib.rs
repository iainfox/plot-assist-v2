// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod parse_file;
use parse_file::FileData;

mod selected_channels_handler;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(FileData::new())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_channels, get_index, get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

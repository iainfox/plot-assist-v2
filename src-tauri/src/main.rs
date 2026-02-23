// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod read_file_passed;

fn main() {
    read_file_passed::run();
    plot_assist_v2_lib::run()
}

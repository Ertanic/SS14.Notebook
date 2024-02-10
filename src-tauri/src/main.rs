// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::generate_handler;

mod commands;
use commands::*;

fn main() {
    tauri::Builder::default()
        // TODO: In the future, replace it with rus sqlite and rewrite the repositories into commands
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(generate_handler![read_quotes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

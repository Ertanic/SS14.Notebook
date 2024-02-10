use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Default)]
pub struct Quote {
    pub author: String,
    pub text: String,
}

#[derive(Serialize, Deserialize, Default)]
pub struct QuotesCollection {
    pub quotes: Vec<Quote>,
}

#[tauri::command]
pub fn read_quotes(app: tauri::AppHandle) -> QuotesCollection {
    let file_path = app.path_resolver().resolve_resource("data/quotes.toml").unwrap();
    let content = tauri::api::file::read_string(file_path).unwrap_or_default();
    let quotes: QuotesCollection = toml::from_str(&content).unwrap_or_default();

    quotes
}

#[tauri::command]
pub fn read_recipes(app: tauri::AppHandle) -> Value {
    let file_path = app.path_resolver().resolve_resource("data/recipes.json").unwrap();
    let content = tauri::api::file::read_string(file_path).unwrap_or_default();
    let recipes = serde_json::from_str(&content).unwrap_or_default();

    recipes
}
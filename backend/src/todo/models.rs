// serde to convert To and From JSON
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct ToDo {
    pub username: Option<String>,
    pub todo_id: Option<String>,
    pub description: Option<String>,
    pub status: bool,
}

#[derive(Deserialize)]
pub struct User {
    pub username: String,
}

#[derive(Deserialize)]
pub struct CreateTodo {
    pub username: String,
    pub description: String,
}

#[derive(Deserialize)]
pub struct UpdateTodo {
    pub description: Option<String>,
    pub status: Option<bool>,
}

// serde to convert To and From JSON
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
pub struct ToDo {
    pub username: Option<String>,
    pub todo_id: Option<String>,
    pub description: Option<String>,
    pub status: bool,
}

#[derive(Deserialize, ToSchema)]
pub struct User {
    pub username: String,
}

#[derive(Deserialize, ToSchema)]
pub struct CreateTodo {
    pub username: String,
    pub description: String,
}

#[derive(Deserialize, ToSchema)]
pub struct UpdateTodo {
    pub description: Option<String>,
    pub status: Option<bool>,
}

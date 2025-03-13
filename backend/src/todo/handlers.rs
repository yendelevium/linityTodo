use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

// serde_json to send JSON responses
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::todo::models::{CreateTodo, ToDo, UpdateTodo, User};

// Todo Routes
pub async fn get_list(
    State(pg_pool): State<PgPool>,
    Json(user): Json<User>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let list = sqlx::query_as!(
        ToDo,
        "SELECT username, todo_id, description, status FROM todos WHERE username = $1",
        user.username
    )
    .fetch_all(&pg_pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success":false, "message":e.to_string()}).to_string(),
        )
    })?;

    println!("Got the Todo list for {}", user.username);
    Ok((
        StatusCode::OK,
        json!({"success":true, "data":list}).to_string(),
    ))
}

pub async fn create_todo(
    State(pg_pool): State<PgPool>,
    Json(new_todo): Json<CreateTodo>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let todo_id = Uuid::new_v4().to_string();

    sqlx::query!(
        "INSERT INTO todos (todo_id, username, description, status) VALUES ($1, $2, $3, false)",
        todo_id,
        new_todo.username,
        new_todo.description
    )
    .execute(&pg_pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success": false, "message": e.to_string()}).to_string(),
        )
    })?;

    println!("Created a new Todo");

    Ok((
        StatusCode::CREATED,
        json!({"success": true, "message": "Todo created successfully", "todo_id": todo_id})
            .to_string(),
    ))
}

// Add Authorization? If time permits
pub async fn update_todo(
    State(pg_pool): State<PgPool>,
    Path(todo_id): Path<String>,
    Json(update): Json<UpdateTodo>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    // Check if todo exists (coz only then can we update/delete it)
    let todo = sqlx::query!("SELECT * FROM todos WHERE todo_id = $1", todo_id)
        .fetch_optional(&pg_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"success": false, "message": e.to_string()}).to_string(),
            )
        })?;

    if todo.is_none() {
        return Ok((
            StatusCode::NOT_FOUND,
            json!({"success": false, "message": "Todo not found"}).to_string(),
        ));
    }

    // Update description
    if let Some(description) = &update.description {
        sqlx::query!(
            "UPDATE todos SET description = $1 WHERE todo_id = $2",
            description,
            todo_id
        )
        .execute(&pg_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"success": false, "message": e.to_string()}).to_string(),
            )
        })?;
        println!("Updated description of the Todo");
    }

    // Update status
    if let Some(status) = update.status {
        sqlx::query!(
            "UPDATE todos SET status = $1 WHERE todo_id = $2",
            status,
            todo_id
        )
        .execute(&pg_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"success": false, "message": e.to_string()}).to_string(),
            )
        })?;
        println!("Updated status of the Todo");
    }

    Ok((
        StatusCode::OK,
        json!({"success": true, "message": "Todo updated successfully"}).to_string(),
    ))
}

pub async fn delete_todo(
    State(pg_pool): State<PgPool>,
    Path(todo_id): Path<String>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let result = sqlx::query!("DELETE FROM todos WHERE todo_id = $1", todo_id)
        .execute(&pg_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"success": false, "message": e.to_string()}).to_string(),
            )
        })?;

    // Check if todo was there in the table, by seeing if any rows were affected or not
    if result.rows_affected() == 0 {
        return Ok((
            StatusCode::NOT_FOUND,
            json!({"success": false, "message": "Todo not found"}).to_string(),
        ));
    }

    println!("Deleted the Todo");

    Ok((
        StatusCode::OK,
        json!({"success": true, "message": "Todo deleted successfully"}).to_string(),
    ))
}

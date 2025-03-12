use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::{get, put},
};

// serde to convert To and From JSON
// serde_json to send JSON responses
use serde::{Deserialize, Serialize};
use serde_json::json;

use sqlx::{PgPool, postgres::PgPoolOptions};

// tokio for async rust code
use tokio::net::TcpListener;
use uuid::Uuid;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to parse .env file");

    // Defaulting to localhost:8080 if we don't get the server_address, but we panic and exit if db_url idn't found coz obviously
    let server_address = std::env::var("SERVER_ADDRESS").unwrap_or("127.0.0.1:8080".to_owned());
    let db_url = std::env::var("DB_URL").expect("Couldn't retrieve DB_URL from .env file");

    // Using a database_pool prevents reconnection to the DB for every request, and helps with concurrent requests to the server
    let db_pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&db_url)
        .await
        .expect("Couldn't connect to the database");

    // Maybe use a logger?
    println!("Connection to DB estabilished");

    let listener = TcpListener::bind(server_address)
        .await
        .expect("Couldn't create a TCP Listener");

    let router = Router::new()
        .route("/todo", get(get_list).post(create_todo))
        .route("/todo/{todo_id}", put(update_todo).delete(delete_todo))
        .with_state(db_pool);

    println!("Listening on: {}", listener.local_addr().unwrap());
    axum::serve(listener, router)
        .await
        .expect("Couldn't start the server");
}

#[derive(Serialize)]
struct ToDo {
    username: Option<String>,
    todo_id: Option<String>,
    description: Option<String>,
    status: bool,
}

#[derive(Deserialize)]
struct User {
    username: String,
}

#[derive(Deserialize)]
struct CreateTodo {
    username: String,
    description: String,
}

#[derive(Deserialize)]
struct UpdateTodo {
    description: Option<String>,
    status: Option<bool>,
}

// Todo Routes
async fn get_list(
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

    Ok((
        StatusCode::OK,
        json!({"success":true, "data":list}).to_string(),
    ))
}

async fn create_todo(
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

    Ok((
        StatusCode::CREATED,
        json!({"success": true, "message": "Todo created successfully", "todo_id": todo_id})
            .to_string(),
    ))
}

// Add Authorization? If time permits
async fn update_todo(
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
    }

    Ok((
        StatusCode::OK,
        json!({"success": true, "message": "Todo updated successfully"}).to_string(),
    ))
}

async fn delete_todo(
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

    Ok((
        StatusCode::OK,
        json!({"success": true, "message": "Todo deleted successfully"}).to_string(),
    ))
}

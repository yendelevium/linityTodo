use axum::{
    Json, Router,
    extract::{Path, State},
    handler,
    http::StatusCode,
    routing::{delete, get, post, put},
};

// serde to convert To and From JSON
// serde_json to send JSON responses
use serde::{Deserialize, Serialize};
use serde_json::json;

use sqlx::{PgPool, postgres::PgPoolOptions};

// tokio for async rust code
use tokio::net::TcpListener;

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

    let router: Router = Router::new().route("/", get(|| async { "WASSAAPPP" }));

    println!("Listening on: {}", listener.local_addr().unwrap());
    axum::serve(listener, router)
        .await
        .expect("Couldn't start the server");
}
